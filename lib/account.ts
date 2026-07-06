"use client";

/* Account dashboard data — profiles, orders, downloads, addresses.
   Every table is RLS-scoped to the signed-in user, so these helpers
   never need to filter by user id on reads. */

import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  created_at: string;
  email: string;
  name: string;
};

export type OrderItem = {
  product_id?: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
};

export type Download = {
  id: string;
  created_at: string;
  name: string;
  note: string;
  url: string;
};

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
};

export type NewAddress = Omit<Address, "id" | "is_default">;

const FAIL = "That didn't go through. Try again.";

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await createClient().from("profiles").select("*").single();
  if (error) {
    console.error("[profile]", error.message);
    return null;
  }
  return data;
}

export async function updateName(userId: string, name: string): Promise<string | null> {
  const { error } = await createClient()
    .from("profiles")
    .update({ name: name.trim() })
    .eq("id", userId);
  if (error) {
    console.error("[profile]", error.message);
    return FAIL;
  }
  return null;
}

export async function changePassword(password: string): Promise<string | null> {
  const { error } = await createClient().auth.updateUser({ password });
  if (error) return error.message;
  return null;
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await createClient()
    .from("orders")
    .select("id, created_at, status, total, items")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[orders]", error.message);
    return [];
  }
  return (data ?? []) as Order[];
}

export async function listDownloads(): Promise<Download[]> {
  const { data, error } = await createClient()
    .from("downloads")
    .select("id, created_at, name, note, url")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[downloads]", error.message);
    return [];
  }
  return data ?? [];
}

export async function listAddresses(): Promise<Address[]> {
  const { data, error } = await createClient()
    .from("addresses")
    .select("id, label, name, line1, line2, city, state, pincode, phone, is_default")
    .order("is_default", { ascending: false })
    .order("created_at");
  if (error) {
    console.error("[addresses]", error.message);
    return [];
  }
  return data ?? [];
}

export async function addAddress(
  userId: string,
  addr: NewAddress,
  makeDefault: boolean
): Promise<string | null> {
  const client = createClient();
  if (makeDefault) {
    await client.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }
  const { error } = await client
    .from("addresses")
    .insert({ ...addr, user_id: userId, is_default: makeDefault });
  if (error) {
    console.error("[addresses]", error.message);
    return FAIL;
  }
  return null;
}

export async function removeAddress(id: string): Promise<string | null> {
  const { error } = await createClient().from("addresses").delete().eq("id", id);
  if (error) {
    console.error("[addresses]", error.message);
    return FAIL;
  }
  return null;
}

export async function setDefaultAddress(
  userId: string,
  id: string
): Promise<string | null> {
  const client = createClient();
  const { error: clearErr } = await client
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId);
  const { error } = await client.from("addresses").update({ is_default: true }).eq("id", id);
  if (clearErr || error) {
    console.error("[addresses]", (clearErr ?? error)!.message);
    return FAIL;
  }
  return null;
}
