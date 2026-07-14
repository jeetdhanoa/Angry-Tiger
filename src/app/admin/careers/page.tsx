"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteRow, getCvUrl, listCareerApplications, type CareerRow } from "@/lib/admin";

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const KIND_LABEL: Record<CareerRow["kind"], string> = {
  crew: "Crew",
  cast: "Cast",
  creative: "Creative",
};

export default function AdminCareers() {
  const [rows, setRows] = useState<CareerRow[] | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const refresh = useCallback(() => listCareerApplications().then(setRows), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (r: CareerRow) => {
    if (!window.confirm(`Delete the application from ${r.name}? This can't be undone.`)) return;
    await deleteRow("careers", r.id);
    refresh();
  };

  const downloadCv = async (r: CareerRow) => {
    if (!r.cv_path) return;
    setDownloading(r.id);
    const url = await getCvUrl(r.cv_path);
    setDownloading(null);
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Join the house</h2>
      {rows === null ? null : rows.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">No applications yet.</p>
          <p className="acct-empty__sub">Crew, cast and creative applications from Production land here.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {rows.map((r) => (
            <div key={r.id} className="adm-prod">
              <div className="adm-prod__head">
                <span className="acct-row__value">
                  {r.name} · {KIND_LABEL[r.kind]} ·{" "}
                  <a href={`mailto:${r.email}`} className="adm-mail">
                    {r.email}
                  </a>
                </span>
                <span className="acct-row__label">{dateOf(r.created_at)}</span>
              </div>
              <span className="acct-row__label">{r.discipline}</span>
              {r.link && (
                <a href={r.link} target="_blank" rel="noopener" className="adm-mail">
                  {r.link}
                </a>
              )}
              {r.message && <p className="adm-story">{r.message}</p>}
              <div className="addr-card__actions">
                {r.cv_path && (
                  <button
                    type="button"
                    className="addr-card__action"
                    onClick={() => downloadCv(r)}
                    disabled={downloading === r.id}
                  >
                    {downloading === r.id ? "Opening…" : `Download CV (${r.cv_name ?? "file"})`}
                  </button>
                )}
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
