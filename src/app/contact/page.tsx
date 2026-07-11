"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Input, Textarea } from "@/components/Input";
import CaptionLabel from "@/components/CaptionLabel";
import Turnstile from "@/components/Turnstile";
import { submitContact } from "@/lib/submissions";

/* The page is built around the three ways people approach a production
   house: money (producers, financiers, studios), commissions (brands,
   labels, agencies), and stories (writers, directors). Each path gets its
   own door on the left; the form on the right carries the same three
   paths as a selector, and the choice is prefixed into the message so
   enquiries arrive pre-sorted in the contact table. */
const PATHS = [
  {
    key: "Back a project",
    blurb:
      "Producers, financiers and studios. The first slate is in development, and we move fast with partners who move early.",
    email: "hello@angrytiger.in",
    subject: "Backing a project",
    placeholder: "Tell us who you are and what you want to back.",
  },
  {
    key: "Commission a shoot",
    blurb:
      "Brands, labels and agencies. Films, campaigns and music videos, shot by the house with the same fearless eye.",
    email: "hello@angrytiger.in",
    subject: "Commissioning a shoot",
    placeholder: "What are we shooting, for whom, and when?",
  },
  {
    key: "Pitch a story",
    blurb:
      "Writers and directors. Start with a logline and the first ten pages. If we lean in, we ask for the rest.",
    email: "submissions@angrytiger.in",
    subject: "Story submission",
    placeholder: "Logline first.",
  },
] as const;

type PathKey = (typeof PATHS)[number]["key"];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState<PathKey>("Back a project");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");

  const activePath = PATHS.find((p) => p.key === type) ?? PATHS[0];

  const send = async () => {
    setError("");
    setBusy(true);
    const res = await submitContact(
      // The selected path rides along in the message so the inbox reads
      // "[Back a project] ..." without any backend changes.
      { name, email, story: `[${type}] ${story}` },
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
        <p className="contact-hero__lede">
          We make Feature Films, Television and Vertical Series, and we shoot for
          people who want something different. Producers, financiers, brands,
          writers: the door is open.
        </p>
        <span className="contact-hero__script">let&apos;s shoot something</span>
      </section>

      <section className="contact-body">
        <div className="contact-info">
          {PATHS.map((p) => (
            <div key={p.key} className="contact-block">
              <CaptionLabel>{p.key}</CaptionLabel>
              <p className="contact-block__body">{p.blurb}</p>
              <a
                href={`mailto:${p.email}?subject=${encodeURIComponent(p.subject)}`}
                className="contact-block__email"
                data-letter-hover="1"
              >
                {p.email}
              </a>
            </div>
          ))}
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
              <div className="field">
                <span>I&apos;m here to</span>
                <div className="contact-type-row">
                  {PATHS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      className={`contact-type${type === p.key ? " contact-type--active" : ""}`}
                      onClick={() => setType(p.key)}
                    >
                      {p.key}
                    </button>
                  ))}
                </div>
              </div>
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
                label="The details"
                placeholder={activePath.placeholder}
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
              <p className="contact-form__note">We read everything, and we reply fast.</p>
              <Turnstile onToken={setCaptcha} />
              {error && <span className="form-error">{error}</span>}
            </div>
          ) : (
            <div className="contact-form__sent">
              <p className="contact-form__sent-title">Received.</p>
              <p className="contact-form__sent-body">
                We read everything. You&apos;ll hear from hello@angrytiger.in.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
