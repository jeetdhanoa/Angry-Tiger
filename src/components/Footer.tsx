"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import Turnstile from "@/components/Turnstile";
import { joinNewsletter } from "@/lib/submissions";

export default function Footer() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await joinNewsletter(email, { website: hp, captchaToken: captcha });
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "That didn't go through.");
      return;
    }
    setJoined(true);
  };

  return (
    <footer className="footer">
      <div className="footer__newsletter">
        <div className="footer__newsletter-copy">
          <span className="lead">First to know</span>
          <span className="sub">Announcements, premieres, drops. No noise.</span>
        </div>
        {!joined ? (
          <form className="footer__signup" onSubmit={signUp}>
            <Input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              aria-invalid={!!error}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              className="hp-field"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
            <Button type="submit" variant="primary" size="md" disabled={busy}>
              {busy ? "Signing up…" : "Sign up"}
            </Button>
            <Turnstile onToken={setCaptcha} />
            {error && (
              <span className="form-error" role="alert">
                {error}
              </span>
            )}
          </form>
        ) : (
          <p className="footer__joined" role="status">
            You&apos;re on the list.
          </p>
        )}
      </div>
      <div className="footer__cols">
        <div className="footer__col-group">
          <div className="footer__col">
            <span className="footer__col-title">Contact</span>
            <a href="mailto:hello@angrytiger.in" className="footer__link" data-letter-hover="1">
              hello@angrytiger.in
            </a>
            <Link href="/contact" className="footer__link footer__link--muted" data-letter-hover="1">
              Submissions →
            </Link>
            <Link
              href="/production#join"
              className="footer__link footer__link--muted"
              data-letter-hover="1"
            >
              Jobs →
            </Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Explore</span>
            <Link href="/films" className="footer__link" data-letter-hover="1">
              Films
            </Link>
            <Link href="/television" className="footer__link" data-letter-hover="1">
              Television
            </Link>
            <Link href="/vertical" className="footer__link" data-letter-hover="1">
              Vertical
            </Link>
            <Link href="/about" className="footer__link" data-letter-hover="1">
              About the House
            </Link>
            <Link href="/production" className="footer__link" data-letter-hover="1">
              Production
            </Link>
          </div>
        </div>
        <img
          src="/logos/at-brand-symbol-red.svg"
          alt="Angry Tiger tiger mark"
          className="footer__mark"
        />
        <div className="footer__col footer__col--right">
          <span className="footer__col-title">Follow</span>
          <a
            href="https://instagram.com/angrytigerstudios"
            target="_blank"
            rel="noopener"
            className="footer__link"
            data-letter-hover="1"
          >
            Instagram ↗
          </a>
          <a
            href="https://youtube.com/@angrytigerstudios"
            target="_blank"
            rel="noopener"
            className="footer__link"
            data-letter-hover="1"
          >
            YouTube ↗
          </a>
          <a
            href="https://x.com/AngryTigerX"
            target="_blank"
            rel="noopener"
            className="footer__link"
            data-letter-hover="1"
          >
            Twitter ↗
          </a>
        </div>
      </div>
      <p className="footer__tagline">Stay Angry.</p>
      <p className="footer__credit">© 2026 Angry Tiger. All Rights Reserved.</p>
    </footer>
  );
}
