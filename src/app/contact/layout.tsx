import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Angry Tiger",
  description:
    "Talk to the tiger. Back a project, commission a shoot, or pitch a story. hello@angrytiger.in",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
