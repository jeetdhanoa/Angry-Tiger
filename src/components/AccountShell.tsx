"use client";

/* The member dashboard frame: auth gate + section rail.
   Sections render as children (App Router nested routes). */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { fetchIsAdmin } from "@/lib/admin";

const SECTIONS = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Downloads", href: "/account/downloads" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Account settings", href: "/account/settings" },
];

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, loading, configured, signOut } = useAuth();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) fetchIsAdmin().then(setIsAdmin);
    else setIsAdmin(false);
  }, [user]);

  return (
    <main className="page" id="main-content">
      {loading ? (
        <section className="acct" aria-busy="true" />
      ) : !configured || !user ? (
        <section className="acct acct--gate">
          <span className="caption-label">Account</span>
          <h1 className="display acct__gate-title">
            Members only<span className="red-period">.</span>
          </h1>
          <p className="acct__gate-lede">
            Sign in to see your profile, orders, downloads and addresses. Not with
            us yet? Creating an account takes a minute.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.dispatchEvent(new CustomEvent("at-open-account"))}
          >
            Sign in
          </Button>
        </section>
      ) : (
        <section className="acct">
          <span className="caption-label">Account</span>
          <h1 className="display acct__title">
            The member&apos;s room<span className="red-period">.</span>
          </h1>
          <div className="acct__grid">
            <nav className="acct-rail" aria-label="Account sections">
              {SECTIONS.map((s) => (
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
              {isAdmin && (
                <Link href="/admin" className="acct-rail__link acct-rail__link--office">
                  The office →
                </Link>
              )}
              <button type="button" className="acct-rail__link acct-rail__signout" onClick={signOut}>
                Log out
              </button>
            </nav>
            <div className="acct__content">{children}</div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
