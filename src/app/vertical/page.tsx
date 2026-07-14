import type { Metadata } from "next";
import FormatBlock from "@/components/FormatBlock";
import Footer from "@/components/Footer";

const description =
  "Vertical series from Angry Tiger, made for the way people actually watch. In development now.";

export const metadata: Metadata = {
  title: "Vertical — Angry Tiger",
  description,
  openGraph: { title: "Vertical — Angry Tiger", description, url: "/vertical" },
  twitter: { title: "Vertical — Angry Tiger", description },
};

const SLATES = [
  { code: "V01", titleBar: "min(260px, 50vw)", genreBar: 76 },
  { code: "V02", titleBar: "min(300px, 54vw)", genreBar: 52 },
];

export default function Vertical() {
  return (
    <main className="page" id="main-content">
      <FormatBlock
        heading="Vertical series."
        lede="Vertical series made for the way people actually watch. In development now."
        slates={SLATES}
        full
      />
      <Footer />
    </main>
  );
}
