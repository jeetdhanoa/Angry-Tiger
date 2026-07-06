"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { submitContact } from "@/lib/submissions";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setError("");
    setBusy(true);
    const res = await submitContact({ name, email, story });
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
            <span className="caption-label">General</span>
            <a
              href="mailto:hello@angrytiger.in"
              className="contact-block__email"
              data-letter-hover="1"
            >
              hello@angrytiger.in
            </a>
          </div>
          <div className="contact-block">
            <span className="caption-label">Submissions</span>
            <p className="contact-block__body">
              Scripts, loglines, reels. Start with a logline and the first ten pages. If
              we lean in, we&apos;ll ask for the rest.
            </p>
          </div>
          <div className="contact-block">
            <span className="caption-label">Follow</span>
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
            </div>
          </div>
        </div>

        <div className="contact-form">
          {!sent ? (
            <div className="contact-form__fields">
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  className="input-dark"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Your story</span>
                <textarea
                  className="input-dark"
                  placeholder="Logline first."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                />
              </label>
              <Button
                variant="primary"
                size="md"
                style={{ alignSelf: "flex-start" }}
                onClick={send}
                disabled={busy}
              >
                {busy ? "Sending…" : "Send it"}
              </Button>
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
