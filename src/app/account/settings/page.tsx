"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { changePassword, getProfile, updateName } from "@/lib/account";

export default function SettingsSection() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [nameNotice, setNameNotice] = useState("");
  const [nameBusy, setNameBusy] = useState(false);

  const [pw, setPw] = useState("");
  const [pwNotice, setPwNotice] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    if (user) getProfile(user.id).then((p) => setName(p?.name ?? ""));
  }, [user]);

  const saveName = async () => {
    if (!user) return;
    setNameNotice("");
    setNameBusy(true);
    const err = await updateName(user.id, name);
    setNameBusy(false);
    setNameNotice(err ?? "Saved.");
  };

  const savePassword = async () => {
    setPwError("");
    setPwNotice("");
    if (pw.length < 6) {
      setPwError("At least 6 characters.");
      return;
    }
    setPwBusy(true);
    const err = await changePassword(pw);
    setPwBusy(false);
    if (err) {
      setPwError(err);
      return;
    }
    setPw("");
    setPwNotice("Password updated.");
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Account settings</h2>

      <div className="acct-form">
        <label className="field">
          <span>Your name</span>
          <input
            className="input-dark"
            placeholder="The name on your card"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div className="acct-form__actions">
          <Button variant="primary" size="md" onClick={saveName} disabled={nameBusy}>
            {nameBusy ? "Saving…" : "Save name"}
          </Button>
          {nameNotice && <span className="acct-notice">{nameNotice}</span>}
        </div>
      </div>

      <div className="acct-form">
        <label className="field">
          <span>New password</span>
          <input
            type="password"
            className="input-dark"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        <div className="acct-form__actions">
          <Button variant="secondary" size="md" onClick={savePassword} disabled={pwBusy}>
            {pwBusy ? "Updating…" : "Update password"}
          </Button>
          {pwNotice && <span className="acct-notice">{pwNotice}</span>}
          {pwError && <span className="form-error">{pwError}</span>}
        </div>
      </div>

      <div className="acct-form acct-form--signout">
        <span className="caption-label">Signed in as {user?.email}</span>
        <Button
          variant="secondary"
          size="md"
          style={{ alignSelf: "flex-start" }}
          onClick={signOut}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
