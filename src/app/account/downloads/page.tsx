"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { listDownloads, type Download } from "@/lib/account";

export default function DownloadsSection() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<Download[] | null>(null);

  useEffect(() => {
    if (user) listDownloads().then(setDownloads);
  }, [user]);

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Downloads</h2>
      {downloads === null ? null : downloads.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">Nothing to pull down yet.</p>
          <p className="acct-empty__sub">
            Screeners, wallpapers and digital drops land here with our first release.
          </p>
        </div>
      ) : (
        <div className="acct-rows">
          {downloads.map((d) => (
            <div key={d.id} className="acct-row acct-row--download">
              <div>
                <span className="acct-row__value">{d.name}</span>
                {d.note && <span className="acct-download__note">{d.note}</span>}
              </div>
              <a
                href={d.url}
                target="_blank"
                rel="noopener"
                className="underline-link acct-download__link"
              >
                Download ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
