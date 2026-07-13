"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { rupees } from "@/lib/format";
import { listOrders, type Order } from "@/lib/account";

const orderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function OrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (user) listOrders(user.id).then(setOrders);
  }, [user]);

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Orders</h2>
      {orders === null ? null : orders.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">Nothing yet.</p>
          <p className="acct-empty__sub">Your orders will live here.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {orders.map((o) => (
            <div key={o.id} className="acct-order">
              <div className="acct-order__head">
                <span className="acct-row__label">
                  {orderDate(o.created_at)} · {o.status}
                </span>
                <span className="acct-order__total">{rupees(o.total)}</span>
              </div>
              {o.items.map((it, i) => (
                <div key={i} className="acct-order__item">
                  <span className="acct-order__item-name">{it.name}</span>
                  <span className="acct-row__label">
                    {it.size ? `Size ${it.size} · ` : ""}× {it.qty}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
