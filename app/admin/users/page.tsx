"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { listProfiles, setAdminFlag, type AdminProfile } from "@/lib/admin";

const joinedDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminUsers() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<AdminProfile[] | null>(null);

  const refresh = useCallback(() => listProfiles().then(setProfiles), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleAdmin = async (p: AdminProfile) => {
    const msg = p.is_admin
      ? `Take the office keys away from ${p.email}?`
      : `Hand ${p.email} the office keys? They'll be able to manage everything here.`;
    if (!window.confirm(msg)) return;
    await setAdminFlag(p.id, !p.is_admin);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Users</h2>
      {profiles === null ? null : profiles.length === 0 ? (
        <div className="acct-empty">
          <p className="acct-empty__title">Nobody&apos;s signed up yet.</p>
        </div>
      ) : (
        <div className="acct-rows">
          {profiles.map((p) => (
            <div key={p.id} className="adm-prod">
              <div className="adm-prod__head">
                <span className="acct-row__value">{p.email}</span>
                {p.is_admin && <span className="adm-badge">Admin</span>}
              </div>
              <div className="adm-prod__meta">
                <span>
                  {p.name || "no name set"} · joined {joinedDate(p.created_at)}
                </span>
              </div>
              {p.id !== user?.id && (
                <div className="addr-card__actions">
                  <button
                    type="button"
                    className={`addr-card__action${p.is_admin ? " addr-card__action--danger" : ""}`}
                    onClick={() => toggleAdmin(p)}
                  >
                    {p.is_admin ? "Revoke admin" : "Make admin"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="acct-empty__sub">
        Password resets and account deletion live in Supabase → Authentication → Users.
      </p>
    </div>
  );
}
