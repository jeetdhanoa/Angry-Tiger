import type { Metadata } from "next";
import AccountShell from "@/components/AccountShell";

export const metadata: Metadata = {
  title: "Account — Angry Tiger",
  description: "Your Angry Tiger account: profile, orders, downloads and addresses.",
  robots: { index: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
