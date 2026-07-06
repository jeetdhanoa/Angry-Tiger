"use client";

/* Shared cart + account state.
   Prototype persistence carried over from the design: localStorage
   "at-cart-v1" and "at-account-v1". Replace with a real cart service
   and auth backend when commerce goes live. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "at-cart-v1";

function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
    const sync = () => setItems(readCart());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const write = useCallback((next: CartItem[]) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
    setItems(next);
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">) => {
      const cart = readCart();
      const existing = cart.find((it) => it.id === item.id);
      if (existing) existing.qty += 1;
      else cart.push({ ...item, qty: 1 });
      write(cart);
      setCartOpen(true);
    },
    [write]
  );

  const inc = useCallback(
    (id: string) => write(items.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c))),
    [items, write]
  );

  const dec = useCallback(
    (id: string) => {
      const it = items.find((c) => c.id === id);
      if (!it) return;
      write(
        it.qty > 1
          ? items.map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
          : items.filter((c) => c.id !== id)
      );
    },
    [items, write]
  );

  const remove = useCallback(
    (id: string) => write(items.filter((c) => c.id !== id)),
    [items, write]
  );

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
