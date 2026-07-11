import type { Metadata } from "next";
import FormatBlock from "@/components/FormatBlock";
import Footer from "@/components/Footer";

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
    <div className="page">
      <FormatBlock
        eyebrow="Television"
        heading="Television."
        lede="Series built to break the pattern. Our first television slate is in development."
        slates={SLATES}
        full
        cta
      />
      <Footer />
    </div>
  );
}
