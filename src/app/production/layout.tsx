import type { Metadata } from "next";

const description =
  "A full unit under one roof. Features, series, verticals, commercials and music videos, from development through delivery. Join the crew, or sign with the house.";

export const metadata: Metadata = {
  title: "Production — Angry Tiger",
  description,
  openGraph: { title: "Production — Angry Tiger", description, url: "/production" },
  twitter: { title: "Production — Angry Tiger", description },
};

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
