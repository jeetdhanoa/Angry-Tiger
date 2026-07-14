import type { Metadata } from "next";
import FormatBlock from "@/components/FormatBlock";
import Footer from "@/components/Footer";

const description =
  "Television from Angry Tiger — series built to break the pattern. Our first slate is in development.";

export const metadata: Metadata = {
  title: "Television — Angry Tiger",
  description,
  openGraph: { title: "Television — Angry Tiger", description, url: "/television" },
  twitter: { title: "Television — Angry Tiger", description },
};

const SLATES = [
  { code: "T01", titleBar: "min(300px, 56vw)", genreBar: 88 },
  { code: "T02", titleBar: "min(240px, 46vw)", genreBar: 64 },
];

export default function Television() {
  return (
    <main className="page" id="main-content">
      <FormatBlock
        heading="Television."
        lede="Series built to break the pattern. Our first television slate is in development."
        slates={SLATES}
        full
      />
      <Footer />
    </main>
  );
}
