"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import { deleteRow, listEmails, type EmailRow } from "@/lib/admin";

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminNewsletter() {
  const [rows, setRows] = useState<EmailRow[] | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => listEmails("newsletter").then(setRows), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const copyAll = async () => {
    if (!rows?.length) return;
    try {
      await navigator.clipboard.writeText(rows.map((r) => r.email).join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const remove = async (r: EmailRow) => {
    if (!window.confirm(`Take ${r.email} off the list?`)) return;
    await deleteRow("newsletter", r.id);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Newsletter</h2>
      {rows === null ? null : rows.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">Nobody on the list yet.</p>
        </div>
      ) : (
        <>
          <div className="acct-form__actions">
            <Button variant="secondary" size="sm" onClick={copyAll}>
              {copied ? "Copied." : `Copy all ${rows.length} emails`}
            </Button>
          </div>
          <div className="acct-rows">
            {rows.map((r) => (
              <div key={r.id} className="acct-row acct-row--download">
                <div>
                  <span className="acct-row__value">{r.email}</span>
                  <span className="acct-download__note">{dateOf(r.created_at)}</span>
                </div>
                <button
                  type="button"
                  className="addr-card__action addr-card__action--danger"
                  onClick={() => remove(r)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
