import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Angry Tiger",
  description:
    "Talk to the tiger. General enquiries and story submissions, from scripts and loglines to reels. hello@angrytiger.in",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
