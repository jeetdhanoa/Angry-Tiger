"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);

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
                <input type="text" className="input-dark" placeholder="Your name" />
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" className="input-dark" placeholder="your@email.com" />
              </label>
              <label className="field">
                <span>Your story</span>
                <textarea className="input-dark" placeholder="Logline first." />
              </label>
              <Button
                variant="primary"
                size="md"
                style={{ alignSelf: "flex-start" }}
                onClick={() => setSent(true)}
              >
                Send it
              </Button>
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
