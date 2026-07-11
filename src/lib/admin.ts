"use client";

/* Admin data layer for /admin ("The office"). Every call runs through the
   normal browser client — RLS admin policies (public.is_admin()) are what
   grant access, so a non-admin session gets nothing even if they find
   these functions. */

import { createClient } from "@/lib/supabase/client";
import type { OrderItem } from "@/lib/account";

export type AdminProduct = {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tag: string;
  sizes: string[];
  sold_out: boolean;
  active: boolean;
};

export type NewProduct = Omit<AdminProduct, "id" | "created_at">;

export type AdminOrder = {
  id: string;
  created_at: string;
  user_id: string;
  status: string;
  total: number;
  items: OrderItem[];
};

export type AdminProfile = {
  id: string;
  created_at: string;
  email: string;
  name: string;
  is_admin: boolean;
};

export type EmailRow = { id: string; created_at: string; email: string };

export type ContactRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  story: string;
};

const FAIL = "That didn't go through. Try again.";

export async function fetchIsAdmin(): Promise<boolean> {
  const { data, error } = await createClient().rpc("is_admin");
  if (error) return false;
  return !!data;
}

export type Counts = {
  products: number;
  orders: number;
  users: number;
  newsletter: number;
  waitlist: number;
  contact: number;
};

export async function fetchCounts(): Promise<Counts> {
  const client = createClient();
  const count = async (table: string) => {
    const { count: n } = await client
      .from(table)
      .select("*", { count: "exact", head: true });
    return n ?? 0;
  };
  const [products, orders, users, newsletter, waitlist, contact] = await Promise.all([
    count("products"),
    count("orders"),
    count("profiles"),
    count("newsletter"),
    count("waitlist"),
    count("contact"),
  ]);
  return { products, orders, users, newsletter, waitlist, contact };
}

/* ---------- products ---------- */

export async function listAllProducts(): Promise<AdminProduct[]> {
  const { data, error } = await createClient()
    .from("products")
    .select("*")
    .order("created_at");
  if (error) {
    console.error("[admin products]", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({ ...p, sizes: p.sizes ?? [] }));
}

export async function createProduct(p: NewProduct): Promise<string | null> {
  const { error } = await createClient().from("products").insert(p);
  if (error) {
    console.error("[admin products]", error.message);
    return error.code === "23505" ? "That slug is taken." : FAIL;
  }
  return null;
}

export async function updateProduct(
  id: string,
  patch: Partial<NewProduct>
): Promise<string | null> {
  const { error } = await createClient().from("products").update(patch).eq("id", id);
  if (error) {
    console.error("[admin products]", error.message);
    return error.code === "23505" ? "That slug is taken." : FAIL;
  }
  return null;
}

export async function deleteProduct(id: string): Promise<string | null> {
  const { error } = await createClient().from("products").delete().eq("id", id);
  if (error) {
    console.error("[admin products]", error.message);
    return FAIL;
  }
  return null;
}

/* ---------- orders ---------- */

export async function listAllOrders(): Promise<AdminOrder[]> {
  const { data, error } = await createClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin orders]", error.message);
    return [];
  }
  return (data ?? []) as AdminOrder[];
}

export async function updateOrderStatus(id: string, status: string): Promise<string | null> {
  const { error } = await createClient().from("orders").update({ status }).eq("id", id);
  if (error) {
    console.error("[admin orders]", error.message);
    return FAIL;
  }
  return null;
}

/* ---------- users ---------- */

export async function listProfiles(): Promise<AdminProfile[]> {
  const { data, error } = await createClient()
    .from("profiles")
    .select("id, created_at, email, name, is_admin")
    .order("created_at");
  if (error) {
    console.error("[admin profiles]", error.message);
    return [];
  }
  return data ?? [];
}

export async function setAdminFlag(id: string, value: boolean): Promise<string | null> {
  const { error } = await createClient()
    .from("profiles")
    .update({ is_admin: value })
    .eq("id", id);
  if (error) {
    console.error("[admin profiles]", error.message);
    return FAIL;
  }
  return null;
}

/* ---------- form tables ---------- */

export async function listEmails(table: "newsletter" | "waitlist"): Promise<EmailRow[]> {
  const { data, error } = await createClient()
    .from(table)
    .select("id, created_at, email")
    .order("created_at");
  if (error) {
    console.error(`[admin ${table}]`, error.message);
    return [];
  }
  return data ?? [];
}

export async function listContactMessages(): Promise<ContactRow[]> {
  const { data, error } = await createClient()
    .from("contact")
    .select("id, created_at, name, email, story")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin contact]", error.message);
    return [];
  }
  return data ?? [];
}

export async function deleteRow(
  table: "newsletter" | "waitlist" | "contact",
  id: string
): Promise<string | null> {
  const { error } = await createClient().from(table).delete().eq("id", id);
  if (error) {
    console.error(`[admin ${table}]`, error.message);
    return FAIL;
  }
  return null;
}
