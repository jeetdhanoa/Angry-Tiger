import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password — Angry Tiger",
  description: "Set a new password for your Angry Tiger account.",
  // Only ever reached via a one-time emailed link — nothing here to index.
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
