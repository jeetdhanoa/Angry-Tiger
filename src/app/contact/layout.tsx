import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Angry Tiger",
  description:
    "Talk to the tiger. General enquiries, working with the house, or pitching a story. hello@angrytiger.in",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
