"use client";

/* Shared cart state (Phase 7 — Supabase cart).

   Signed in  → rows in the `cart` table (RLS: each user sees only their own),
                so the cart follows the user across devices.
   Signed out → localStorage "at-cart-v1", exactly like the design prototype.
   On sign-in → the local cart merges into the account cart (quantities add),
                then localStorage is cleared.

   Legacy note: pre-Phase-7 local items had ids like "tee-M" with no product
   reference; the merge resolves those to catalog rows by slug. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

export type CartItem = {
  id: string; // stable UI key: "<productId>|<size>" for DB rows, legacy id for local rows
  productId: string | null;
  name: string;
  size: string;
  price: number; // whole rupees
  qty: number;
};

export type NewCartItem = {
  productId: string | null;
  legacyId?: string; // local-mode key when there's no product row (fallback catalog)
  name: string;
  size: string;
  price: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: NewCartItem) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "at-cart-v1";

// Legacy local ids were "<prefix>-<size>"; map prefixes to catalog slugs.
const LEGACY_SLUGS: Record<string, string> = { tee: "tiger-tee" };

function legacySlug(id: string): string | null {
  const m = /^([a-z]+)-/i.exec(id);
  return m ? (LEGACY_SLUGS[m[1].toLowerCase()] ?? null) : null;
}

export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

/* ---------- localStorage (guest mode) ---------- */

function readLocal(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((r) => r && r.name && Number(r.qty) > 0)
      .map((r) => ({
        id: String(r.id ?? `${r.productId}|${r.size ?? ""}`),
        productId: r.productId ?? null,
        name: String(r.name),
        size: String(r.size ?? ""),
        price: Number(r.price) || 0,
        qty: Number(r.qty) || 1,
      }));
  } catch {
    return [];
  }
}

function writeLocal(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}

/* ---------- DB cart (signed-in mode) ---------- */

type CartRow = {
  product_id: string;
  size: string | null;
  qty: number;
  product:
    | { name: string; price: number }
    | { name: string; price: number }[]
    | null;
};

function rowToItem(row: CartRow): CartItem | null {
  const product = Array.isArray(row.product) ? row.product[0] : row.product;
  if (!product) return null;
  const size = row.size ?? "";
  return {
    id: `${row.product_id}|${size}`,
    productId: row.product_id,
    name: product.name.replace(/\.+$/, ""),
    size,
    price: product.price,
    qty: row.qty,
  };
}

async function mergeLocalIntoDb(userId: string) {
  const local = readLocal();
  if (!local.length) return;
  const client = createClient();
  // Resolve legacy ids to product rows by slug.
  const slugs = [
    ...new Set(
      local
        .filter((it) => !it.productId)
        .map((it) => legacySlug(it.id))
        .filter((s): s is string => !!s)
    ),
  ];
  const bySlug: Record<string, string> = {};
  if (slugs.length) {
    const { data } = await client.from("products").select("id, slug").in("slug", slugs);
    for (const p of data ?? []) bySlug[p.slug] = p.id;
  }
  const { data: rows, error } = await client
    .from("cart")
    .select("id, product_id, size, qty");
  if (error) {
    console.error("[cart merge]", error.message);
    return;
  }
  for (const it of local) {
    const slug = it.productId ? null : legacySlug(it.id);
    const productId = it.productId ?? (slug ? bySlug[slug] : undefined);
    if (!productId) continue; // nothing in the catalog to attach this to
    const existing = (rows ?? []).find(
      (r) => r.product_id === productId && (r.size ?? "") === it.size
    );
    if (existing) {
      await client
        .from("cart")
        .update({ qty: existing.qty + it.qty })
        .eq("id", existing.id);
    } else {
      await client
        .from("cart")
        .insert({ user_id: userId, product_id: productId, size: it.size, qty: it.qty });
    }
  }
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
}

/* ---------- provider ---------- */

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const syncedFor = useRef<string | null>(null);

  // DB mode only when Supabase is configured AND someone is signed in.
  const dbUser = supabaseConfigured ? user : null;

  const loadDb = useCallback(async () => {
    const { data, error } = await createClient()
      .from("cart")
      .select("product_id, size, qty, product:products(name, price)")
      .order("created_at");
    if (error) {
      console.error("[cart]", error.message);
      return;
    }
    setItems(
      ((data ?? []) as CartRow[])
        .map(rowToItem)
        .filter((it): it is CartItem => it !== null)
    );
  }, []);

  useEffect(() => {
    if (!dbUser) {
      // Guest (or signed out): local cart, synced across tabs.
      syncedFor.current = null;
      setItems(readLocal());
      const sync = () => setItems(readLocal());
      window.addEventListener("storage", sync);
      return () => window.removeEventListener("storage", sync);
    }
    // Signed in: merge any local cart once per session, then load from DB.
    if (syncedFor.current === dbUser.id) return;
    syncedFor.current = dbUser.id;
    (async () => {
      await mergeLocalIntoDb(dbUser.id);
      await loadDb();
    })();
  }, [dbUser, loadDb]);

  const writeGuest = useCallback((next: CartItem[]) => {
    writeLocal(next);
    setItems(next);
  }, []);

  const add = useCallback(
    (item: NewCartItem) => {
      const size = item.size ?? "";
      const name = item.name.replace(/\.+$/, "");
      if (dbUser && item.productId) {
        const key = `${item.productId}|${size}`;
        const existing = items.find((i) => i.id === key);
        // Optimistic update; reconcile from DB on failure.
        setItems((prev) =>
          existing
            ? prev.map((i) => (i.id === key ? { ...i, qty: i.qty + 1 } : i))
            : [
                ...prev,
                { id: key, productId: item.productId, name, size, price: item.price, qty: 1 },
              ]
        );
        setCartOpen(true);
        const client = createClient();
        const op = existing
          ? client
              .from("cart")
              .update({ qty: existing.qty + 1 })
              .eq("user_id", dbUser.id)
              .eq("product_id", item.productId)
              .eq("size", size)
          : client
              .from("cart")
              .insert({ user_id: dbUser.id, product_id: item.productId, size, qty: 1 });
        op.then(({ error }) => {
          if (error) {
            console.error("[cart add]", error.message);
            loadDb();
          }
        });
        return;
      }
      // Guest mode (or fallback catalog without product rows).
      const key = item.productId
        ? `${item.productId}|${size}`
        : (item.legacyId ?? `${name.toLowerCase().replace(/\s+/g, "-")}-${size}`);
      const existing = items.find((i) => i.id === key);
      writeGuest(
        existing
          ? items.map((i) => (i.id === key ? { ...i, qty: i.qty + 1 } : i))
          : [
              ...items,
              { id: key, productId: item.productId, name, size, price: item.price, qty: 1 },
            ]
      );
      setCartOpen(true);
    },
    [dbUser, items, loadDb, writeGuest]
  );

  const setQty = useCallback(
    (id: string, qty: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const next =
        qty > 0
          ? items.map((i) => (i.id === id ? { ...i, qty } : i))
          : items.filter((i) => i.id !== id);
      if (dbUser && item.productId) {
        setItems(next); // optimistic
        const client = createClient();
        const op =
          qty > 0
            ? client
                .from("cart")
                .update({ qty })
                .eq("user_id", dbUser.id)
                .eq("product_id", item.productId)
                .eq("size", item.size)
            : client
                .from("cart")
                .delete()
                .eq("user_id", dbUser.id)
                .eq("product_id", item.productId)
                .eq("size", item.size);
        op.then(({ error }) => {
          if (error) {
            console.error("[cart update]", error.message);
            loadDb();
          }
        });
        return;
      }
      writeGuest(next);
    },
    [dbUser, items, loadDb, writeGuest]
  );

  const inc = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) setQty(id, item.qty + 1);
    },
    [items, setQty]
  );

  const dec = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) setQty(id, item.qty - 1);
    },
    [items, setQty]
  );

  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);

  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((n, it) => n + it.qty, 0),
        subtotal: items.reduce((n, it) => n + it.price * it.qty, 0),
        add,
        inc,
        dec,
        remove,
        cartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
