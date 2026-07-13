"use client";

/* The office — admin frame, over GateShell with a double gate (signed in +
   is_admin). Admin rights come from RLS's is_admin(); this only decides what
   to render. */

import GateShell from "@/components/GateShell";

const SECTIONS = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Waitlist", href: "/admin/waitlist" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <GateShell
      requireAdmin
      eyebrow="Admin"
      title={
        <>
          The office<span className="red-period">.</span>
        </>
      }
      sections={SECTIONS}
      ariaLabel="Admin sections"
      gate={{
        eyebrow: "The office",
        title: (
          <>
            Crew only<span className="red-period">.</span>
          </>
        ),
        lede: (signedIn) =>
          signedIn
            ? "This account doesn't have keys to the office. If it should, the house knows where to find you."
            : "This door is for the house. Sign in with the right account.",
        showSignIn: (signedIn) => !signedIn,
      }}
    >
      {children}
    </GateShell>
  );
}
