import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production — Angry Tiger",
  description:
    "A full unit under one roof. Features, series, verticals, commercials and music videos, from development through delivery. Join the crew, or sign with the house.",
};

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
