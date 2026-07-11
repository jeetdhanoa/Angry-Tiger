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

  const signUp = async () => {
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
          <div className="footer__signup">
            <Input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") signUp();
              }}
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
            <Button variant="primary" size="md" onClick={signUp} disabled={busy}>
              {busy ? "Signing up…" : "Sign up"}
            </Button>
            <Turnstile onToken={setCaptcha} />
            {error && <span className="form-error">{error}</span>}
          </div>
        ) : (
          <p className="footer__joined">You&apos;re on the list.</p>
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
            <a
              href="mailto:hello@angrytiger.in?subject=Jobs"
              className="footer__link footer__link--muted"
              data-letter-hover="1"
            >
              Jobs →
            </a>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Explore</span>
            <Link href="/projects" className="footer__link" data-letter-hover="1">
              Projects
            </Link>
            <Link href="/shop" className="footer__link" data-letter-hover="1">
              The Shop
            </Link>
            <Link href="/membership" className="footer__link" data-letter-hover="1">
              The Ambush
            </Link>
            <Link href="/about" className="footer__link" data-letter-hover="1">
              About the House
            </Link>
          </div>
        </div>
        <img
          src="/logos/at-brand-symbol-red.png"
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
        </div>
      </div>
      <p className="footer__credit">© 2026 Angry Tiger. All Rights Reserved.</p>
    </footer>
  );
}
