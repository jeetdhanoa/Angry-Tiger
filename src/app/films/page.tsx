import type { Metadata } from "next";
import FormatBlock from "@/components/FormatBlock";
import Footer from "@/components/Footer";

const description =
  "Feature films and short films from Angry Tiger. Our first slate is in development, and new films get announced here first.";

export const metadata: Metadata = {
  title: "Films — Angry Tiger",
  description,
  openGraph: { title: "Films — Angry Tiger", description, url: "/films" },
  twitter: { title: "Films — Angry Tiger", description },
};

const FEATURES = [
  { code: "F01", titleBar: "min(340px, 60vw)", genreBar: 72 },
  { code: "F02", titleBar: "min(280px, 52vw)", genreBar: 58 },
];

const SHORTS = [
  { code: "S01", titleBar: "min(240px, 46vw)", genreBar: 64 },
  { code: "S02", titleBar: "min(300px, 54vw)", genreBar: 48 },
];

export default function Films() {
  return (
    <main className="page" id="main-content">
      <FormatBlock
        heading="Feature films."
        lede="Our first feature slate is in development. No titles yet. New films get announced here first."
        slates={FEATURES}
        full
      />
      <FormatBlock
        heading="Short films."
        lede="Short films made for festivals and our channel. Raw and in development now."
        slates={SHORTS}
      />
      <Footer />
    </main>
  );
}
