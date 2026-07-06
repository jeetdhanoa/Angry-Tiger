"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getProfile, type Profile } from "@/lib/account";

const memberSince = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function ProfileSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) getProfile().then(setProfile);
  }, [user]);

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Profile</h2>
      <div className="acct-rows">
        <div className="acct-row">
          <span className="acct-row__label">Name</span>
          <span className="acct-row__value">
            {profile ? profile.name || "Not set — add it in account settings" : "…"}
          </span>
        </div>
        <div className="acct-row">
          <span className="acct-row__label">Email</span>
          <span className="acct-row__value">{user?.email}</span>
        </div>
        <div className="acct-row">
          <span className="acct-row__label">Membership</span>
          <span className="acct-row__value">The Ambush opens with our first release</span>
        </div>
        <div className="acct-row">
          <span className="acct-row__label">Member since</span>
          <span className="acct-row__value">
            {profile ? memberSince(profile.created_at) : "…"}
          </span>
        </div>
      </div>
    </div>
  );
}
