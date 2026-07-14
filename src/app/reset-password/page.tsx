"use client";

/* Landing page for the emailed password-reset link. Supabase's client
   detects the recovery token in the URL and establishes a temporary
   session automatically — the same auth listener AuthProvider already
   runs picks it up, so by the time `loading` clears, `user` is either the
   recovery session (link was valid) or null (expired/already used). */

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { changePassword } from "@/lib/account";

export default function ResetPasswordPage() {
  const { user, loading } = useAuth();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pw.length < 6) {
      setError("At least 6 characters.");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const err = await changePassword(pw);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
  };

  return (
    <main className="page" id="main-content">
      <section className="acct acct--gate">
        {loading ? (
          <span className="caption-label">Reset password</span>
        ) : done ? (
          <>
            <span className="caption-label">Reset password</span>
            <h1 className="display acct__gate-title">Done.</h1>
            <p className="acct__gate-lede">
              Your password is updated. Use it next time you sign in.
            </p>
            <Link href="/account">
              <Button variant="primary" size="lg">
                Go to your account →
              </Button>
            </Link>
          </>
        ) : !user ? (
          <>
            <span className="caption-label">Reset password</span>
            <h1 className="display acct__gate-title">Link expired.</h1>
            <p className="acct__gate-lede">
              This reset link is invalid or has already been used. Request a new one
              from the sign-in drawer — click Account, then &quot;Forgot password?&quot;
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.dispatchEvent(new CustomEvent("at-open-account"))}
            >
              Open sign in
            </Button>
          </>
        ) : (
          <>
            <span className="caption-label">Reset password</span>
            <h1 className="display acct__gate-title">New password.</h1>
            <p className="acct__gate-lede">Set a new password for your account.</p>
            <form className="acct-form" onSubmit={submit}>
              <label className="field">
                <span>New password</span>
                <input
                  type="password"
                  className="input-dark"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error}
                />
              </label>
              <label className="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  className="input-dark"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error}
                />
              </label>
              <div className="acct-form__actions">
                <Button type="submit" variant="primary" size="md" disabled={busy}>
                  {busy ? "Updating…" : "Set new password"}
                </Button>
                {error && (
                  <span className="form-error" role="alert">
                    {error}
                  </span>
                )}
              </div>
            </form>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
