"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCounts, type Counts } from "@/lib/admin";

const STATS: { key: keyof Counts; label: string; href: string }[] = [
  { key: "products", label: "Products on the shelf", href: "/admin/products" },
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "users", label: "Members", href: "/admin/users" },
  { key: "newsletter", label: "On the list", href: "/admin/newsletter" },
  { key: "waitlist", label: "In the Ambush queue", href: "/admin/waitlist" },
  { key: "contact", label: "Stories received", href: "/admin/contact" },
];

export default function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    fetchCounts().then(setCounts);
  }, []);

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">The ledger</h2>
      <div className="adm-stats">
        {STATS.map((s) => (
          <Link key={s.key} href={s.href} className="adm-stat">
            <span className="adm-stat__n">{counts ? counts[s.key] : "–"}</span>
            <span className="adm-stat__label">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
