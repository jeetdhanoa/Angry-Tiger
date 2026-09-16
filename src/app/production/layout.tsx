import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const description =
  "A full unit under one roof. Features, series, verticals, commercials and music videos, from development through delivery. Join the crew, or sign with the house.";

export const metadata: Metadata = pageMeta("Production — Angry Tiger", description, "/production");

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
