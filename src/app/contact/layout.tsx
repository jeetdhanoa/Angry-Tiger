import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const description =
  "Talk to the tiger. Say hello, work with the house, or pitch a story. hello@angrytiger.in";

export const metadata: Metadata = pageMeta("Contact — Angry Tiger", description, "/contact");

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
