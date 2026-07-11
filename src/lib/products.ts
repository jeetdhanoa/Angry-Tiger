"use client";

/* Product catalog, read from the public `products` table (RLS: anyone can
   read active rows). Falls back to the seeded Drop 001 data when Supabase
   isn't configured or the fetch fails, so the shop never renders empty. */

import { createClient, supabaseConfigured } from "@/lib/supabase/client";

export type Product = {
  id: string | null; // null only in fallback mode (no DB row to point at)
  slug: string;
  name: string;
  description: string;
  price: number; // whole rupees
  category: string;
  tag: string;
  sizes: string[];
  soldOut: boolean;
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: null,
    slug: "tiger-tee",
    name: "The tiger tee.",
    description:
      "Heavy 240 gsm cotton, cut to fit everyone. The walking tiger, screen printed front and center. Made in India. One drop at a time, and when it's gone, it's gone.",
    price: 1499,
    category: "clothing",
    tag: "Drop 001 · Pre-order",
    sizes: ["S", "M", "L", "XL"],
    soldOut: false,
  },
];

export async function fetchProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return FALLBACK_PRODUCTS;
  try {
    const { data, error } = await createClient()
      .from("products")
      .select("id, slug, name, description, price, category, tag, sizes, sold_out")
      .order("created_at");
    if (error || !data?.length) {
      if (error) console.error("[products]", error.message);
      return FALLBACK_PRODUCTS;
    }
    return data.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      tag: p.tag,
      sizes: p.sizes ?? [],
      soldOut: p.sold_out,
    }));
  } catch (e) {
    console.error("[products]", e);
    return FALLBACK_PRODUCTS;
  }
}
