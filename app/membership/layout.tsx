import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Ambush — Angry Tiger",
  description:
    "The Ambush is the Angry Tiger membership. Screenings, drops, and a say in what gets made. ₹999 a month.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
