import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Angry Tiger",
  description:
    "The Angry Tiger shop. Drop 001: the tiger tee. One drop at a time — the full shop opens alongside our first release.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
