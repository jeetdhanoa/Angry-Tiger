"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Input, Textarea } from "@/components/Input";
import CaptionLabel from "@/components/CaptionLabel";
import Turnstile from "@/components/Turnstile";
import { submitContact } from "@/lib/submissions";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");

  const send = async () => {
    setError("");
    setBusy(true);
    const res = await submitContact(
      { name, email, story },
      { website: hp, captchaToken: captcha }
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "That didn't go through.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="page">
      <section className="contact-hero">
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          Talk to <span className="red-period">the tiger.</span>
        </h1>
        <span className="contact-hero__script">say hi</span>
      </section>

      <section className="contact-body">
        <div className="contact-info">
          <div className="contact-block">
            <CaptionLabel>General</CaptionLabel>
            <a
              href="mailto:hello@angrytiger.in"
              className="contact-block__email"
              data-letter-hover="1"
            >
              hello@angrytiger.in
            </a>
          </div>
          <div className="contact-block">
            <CaptionLabel>Submissions</CaptionLabel>
            <a
              href="mailto:submissions@angrytiger.in"
              className="contact-block__email"
              data-letter-hover="1"
            >
              submissions@angrytiger.in
            </a>
            <p className="contact-block__body">
              Scripts, loglines, reels. Start with a logline and the first ten pages. If
              we lean in, we&apos;ll ask for the rest.
            </p>
          </div>
          <div className="contact-block">
            <CaptionLabel>Follow</CaptionLabel>
            <div className="contact-block__links">
              <a
                href="https://instagram.com/angrytigerstudios"
                target="_blank"
                rel="noopener"
                className="contact-block__link"
                data-letter-hover="1"
              >
                Instagram @angrytigerstudios ↗
              </a>
              <a
                href="https://youtube.com/@angrytigerstudios"
                target="_blank"
                rel="noopener"
                className="contact-block__link"
                data-letter-hover="1"
              >
                YouTube angrytigerstudios ↗
              </a>
              <a
                href="https://x.com/AngryTigerX"
                target="_blank"
                rel="noopener"
                className="contact-block__link"
                data-letter-hover="1"
              >
                Twitter @AngryTigerX ↗
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form">
          {!sent ? (
            <div className="contact-form__fields">
              <Input
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Textarea
                label="Your story"
                placeholder="Logline first."
                value={story}
                onChange={(e) => setStory(e.target.value)}
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
              <Button
                variant="primary"
                size="md"
                style={{ alignSelf: "flex-start" }}
                onClick={send}
                disabled={busy}
              >
                {busy ? "Sending…" : "Send it"}
              </Button>
              <Turnstile onToken={setCaptcha} />
              {error && <span className="form-error">{error}</span>}
            </div>
          ) : (
            <div className="contact-form__sent">
              <p className="contact-form__sent-title">Received.</p>
              <p className="contact-form__sent-body">
                We read everything. If we lean in, you&apos;ll hear from
                hello@angrytiger.in.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
