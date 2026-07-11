import type { Metadata } from "next";
import FormatPage from "@/components/FormatPage";

export const metadata: Metadata = {
  title: "Television — Angry Tiger",
  description:
    "Series and web series from Angry Tiger. Our first television slate is in development.",
};

const SLATES = [
  { code: "T01", titleBar: "min(300px, 56vw)", genreBar: 88 },
  { code: "T02", titleBar: "min(240px, 46vw)", genreBar: 64 },
];

export default function Television() {
  return (
    <FormatPage
      eyebrow="Television"
      heading="Television."
      lede="Series built to break the pattern. Our first television slate is in development."
      groups={[{ label: "The slate", slates: SLATES }]}
    />
  );
}
