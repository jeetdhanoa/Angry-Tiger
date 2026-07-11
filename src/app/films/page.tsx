import type { Metadata } from "next";
import FormatPage from "@/components/FormatPage";

export const metadata: Metadata = {
  title: "Films — Angry Tiger",
  description:
    "Feature films from Angry Tiger. Our first slate is in development — new films get announced here first.",
};

const SLATES = [
  { code: "F01", titleBar: "min(340px, 60vw)", genreBar: 72 },
  { code: "F02", titleBar: "min(280px, 52vw)", genreBar: 58 },
];

export default function Films() {
  return (
    <FormatPage
      eyebrow="Films"
      heading="Feature films."
      lede="Our first feature slate is in development. No titles yet — new films get announced here first."
      slates={SLATES}
    />
  );
}
