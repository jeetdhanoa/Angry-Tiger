import type { Metadata } from "next";

const description =
  "Talk to the tiger. Say hello, work with the house, or pitch a story. hello@angrytiger.in";

export const metadata: Metadata = {
  title: "Contact — Angry Tiger",
  description,
  openGraph: { title: "Contact — Angry Tiger", description, url: "/contact" },
  twitter: { title: "Contact — Angry Tiger", description },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
