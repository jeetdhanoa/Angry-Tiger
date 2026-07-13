"use client";

/* The member dashboard frame — auth gate + section rail, over GateShell.
   Sections render as children (App Router nested routes). */

import Link from "next/link";
import GateShell from "@/components/GateShell";

const SECTIONS = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Downloads", href: "/account/downloads" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Account settings", href: "/account/settings" },
];

export default function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <GateShell
      eyebrow="Account"
      title={
        <>
          The member&apos;s room<span className="red-period">.</span>
        </>
      }
      sections={SECTIONS}
      ariaLabel="Account sections"
      gate={{
        eyebrow: "Account",
        title: (
          <>
            Members only<span className="red-period">.</span>
          </>
        ),
        lede: () =>
          "Sign in to see your profile, orders, downloads and addresses. Not with us yet? Creating an account takes a minute.",
        showSignIn: () => true,
      }}
      railFooter={({ isAdmin, signOut }) => (
        <>
          {isAdmin && (
            <Link href="/admin" className="acct-rail__link acct-rail__link--office">
              The office →
            </Link>
          )}
          <button
            type="button"
            className="acct-rail__link acct-rail__signout"
            onClick={signOut}
          >
            Log out
          </button>
        </>
      )}
    >
      {children}
    </GateShell>
  );
}
