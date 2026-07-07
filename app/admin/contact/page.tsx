"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteRow, listContactMessages, type ContactRow } from "@/lib/admin";

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function AdminContact() {
  const [rows, setRows] = useState<ContactRow[] | null>(null);

  const refresh = useCallback(() => listContactMessages().then(setRows), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (r: ContactRow) => {
    if (!window.confirm(`Delete the story from ${r.email}? This can't be undone.`)) return;
    await deleteRow("contact", r.id);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Stories received</h2>
      {rows === null ? null : rows.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">Nothing in the pile.</p>
          <p className="acct-empty__sub">Submissions from the contact page land here.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {rows.map((r) => (
            <div key={r.id} className="adm-prod">
              <div className="adm-prod__head">
                <span className="acct-row__value">
                  {r.name || "Unnamed"} ·{" "}
                  <a href={`mailto:${r.email}`} className="adm-mail">
                    {r.email}
                  </a>
                </span>
                <span className="acct-row__label">{dateOf(r.created_at)}</span>
              </div>
              <p className="adm-story">{r.story}</p>
              <div className="addr-card__actions">
                <a className="addr-card__action" href={`mailto:${r.email}`}>
                  Reply
                </a>
                <button
                  type="button"
                  className="addr-card__action addr-card__action--danger"
                  onClick={() => remove(r)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
