"use client";

/* Shared frame for the gated dashboards (member account + admin office): the
   auth gate, the section rail, and the signed-in header. AccountShell and
   AdminShell are thin configs over this — they were ~90% identical.

   The gate: wait while auth (and, when required, the is_admin check) resolves,
   then either show the gate panel or the rail + content. Admin rights come
   from RLS's is_admin(); this only decides what to render. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { fetchIsAdmin } from "@/lib/admin";

export type GateShellProps = {
  /** Signed-in header. */
  eyebrow: string;
  title: React.ReactNode;
  sections: { label: string; href: string }[];
  ariaLabel: string;
  /** Require is_admin() to pass the gate (the office), not just a session. */
  requireAdmin?: boolean;
  /** The locked-out panel. `lede`/`showSignIn` can vary on whether the visitor
   *  is signed in (admin distinguishes "wrong account" from "not signed in"). */
  gate: {
    eyebrow: string;
    title: React.ReactNode;
    lede: (signedIn: boolean) => string;
    showSignIn: (signedIn: boolean) => boolean;
  };
  /** Extra rail items rendered after the sections (account adds the office
   *  link + log out). Given the resolved admin flag and signOut. */
  railFooter?: (ctx: { isAdmin: boolean; signOut: () => void }) => React.ReactNode;
  children: React.ReactNode;
};

export default function GateShell({
  eyebrow,
  title,
  sections,
  ariaLabel,
  requireAdmin = false,
  gate,
  railFooter,
  children,
}: GateShellProps) {
  const { user, loading, configured, signOut } = useAuth();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) fetchIsAdmin().then(setIsAdmin);
    else setIsAdmin(null);
  }, [user]);

  const signedIn = !!user;
  // When admin is required we must also wait for the is_admin check to land.
  const checking = loading || (requireAdmin && signedIn && isAdmin === null);
  const passes = configured && signedIn && (!requireAdmin || isAdmin === true);

  return (
    <main className="page" id="main-content">
      {checking ? (
        <section className="acct" aria-busy="true" />
      ) : !passes ? (
        <section className="acct acct--gate">
          <span className="caption-label">{gate.eyebrow}</span>
          <h1 className="display acct__gate-title">{gate.title}</h1>
          <p className="acct__gate-lede">{gate.lede(signedIn)}</p>
          {gate.showSignIn(signedIn) && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.dispatchEvent(new CustomEvent("at-open-account"))}
            >
              Sign in
            </Button>
          )}
        </section>
      ) : (
        <section className="acct">
          <span className="caption-label">{eyebrow}</span>
          <h1 className="display acct__title">{title}</h1>
          <div className="acct__grid">
            <nav className="acct-rail" aria-label={ariaLabel}>
              {sections.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`acct-rail__link${
                    pathname === s.href ? " acct-rail__link--active" : ""
                  }`}
                >
                  {s.label}
                </Link>
              ))}
              {railFooter?.({ isAdmin: isAdmin === true, signOut })}
            </nav>
            <div className="acct__content">{children}</div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
