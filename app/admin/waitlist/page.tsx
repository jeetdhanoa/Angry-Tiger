"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteRow, listEmails, type EmailRow } from "@/lib/admin";

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminWaitlist() {
  const [rows, setRows] = useState<EmailRow[] | null>(null);

  const refresh = useCallback(() => listEmails("waitlist").then(setRows), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (r: EmailRow, position: number) => {
    if (
      !window.confirm(
        `Remove ${r.email} (Nº ${String(position).padStart(3, "0")})? Everyone behind them moves up.`
      )
    )
      return;
    await deleteRow("waitlist", r.id);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">The Ambush queue</h2>
      {rows === null ? null : rows.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">The queue is empty.</p>
          <p className="acct-empty__sub">Nº 001 is still up for grabs.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {rows.map((r, i) => (
            <div key={r.id} className="acct-row acct-row--download">
              <div>
                <span className="acct-row__value">
                  <span className="adm-queue-n">Nº {String(i + 1).padStart(3, "0")}</span>
                  {r.email}
                </span>
                <span className="acct-download__note">{dateOf(r.created_at)}</span>
              </div>
              <button
                type="button"
                className="addr-card__action addr-card__action--danger"
                onClick={() => remove(r, i + 1)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
