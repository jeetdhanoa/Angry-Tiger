"use client";

import { useCallback, useEffect, useState } from "react";
import { rupees } from "@/lib/format";
import {
  listAllOrders,
  listProfiles,
  updateOrderStatus,
  type AdminOrder,
} from "@/lib/admin";

const STATUSES = ["pending", "paid", "shipped", "cancelled"];

const orderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    const [o, profiles] = await Promise.all([listAllOrders(), listProfiles()]);
    setOrders(o);
    setEmails(Object.fromEntries(profiles.map((p) => [p.id, p.email])));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Orders</h2>
      {orders === null ? null : orders.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">No orders yet.</p>
          <p className="acct-empty__sub">The shop&apos;s waiting on its first drop day.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {orders.map((o) => (
            <div key={o.id} className="acct-order">
              <div className="acct-order__head">
                <span className="acct-row__label">
                  {orderDate(o.created_at)} · {emails[o.user_id] ?? "unknown"}
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
              <div className="adm-status">
                <span className="acct-row__label">Status</span>
                <select
                  className="input-dark adm-status__select"
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
