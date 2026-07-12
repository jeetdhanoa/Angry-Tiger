"use client";

/* The office — admin frame: double gate (signed in + is_admin) and the
   section rail. Admin rights come from RLS policies checking is_admin();
   this shell only decides what to render. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { fetchIsAdmin } from "@/lib/admin";

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
  const { user, loading, configured } = useAuth();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setAdmin(null);
      return;
    }
    fetchIsAdmin().then(setAdmin);
  }, [user]);

  const checking = loading || (user && admin === null);

  return (
    <main className="page" id="main-content">
      {checking ? (
        <section className="acct" aria-busy="true" />
      ) : !configured || !user || !admin ? (
        <section className="acct acct--gate">
          <span className="caption-label">The office</span>
          <h1 className="display acct__gate-title">
            Crew only<span className="red-period">.</span>
          </h1>
          <p className="acct__gate-lede">
            {user
              ? "This account doesn't have keys to the office. If it should, the house knows where to find you."
              : "This door is for the house. Sign in with the right account."}
          </p>
          {!user && (
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
          <span className="caption-label">Admin</span>
          <h1 className="display acct__title">
            The office<span className="red-period">.</span>
          </h1>
          <div className="acct__grid">
            <nav className="acct-rail" aria-label="Admin sections">
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
            </nav>
            <div className="acct__content">{children}</div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
