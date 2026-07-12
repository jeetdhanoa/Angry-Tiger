"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Input, Textarea } from "@/components/Input";
import CaptionLabel from "@/components/CaptionLabel";
import Turnstile from "@/components/Turnstile";
import Zoomable from "@/components/Zoomable";
import { submitCareer, type CareerFields } from "@/lib/submissions";

/* The proof page: the house is a working production unit, and the door for
   people who want to be part of it. Three application paths (crew / cast /
   creative) share one form; the CV lands in the private `cvs` bucket via
   /api/careers. Department rows are an honest open call (no invented job
   listings) — every row points at the same form, A24-jobs style. */

const PATHS = [
  {
    key: "crew" as const,
    label: "Join the crew",
    disciplinePlaceholder: "Gaffer, editor, AD, colourist…",
    messagePlaceholder: "Tell us what you've worked on.",
  },
  {
    key: "cast" as const,
    label: "Sign as cast",
    disciplinePlaceholder: "Actor",
    messagePlaceholder: "Tell us about yourself. Reel link above helps.",
  },
  {
    key: "creative" as const,
    label: "Sign as a creative",
    disciplinePlaceholder: "Director, writer, DOP…",
    messagePlaceholder: "Tell us what you make.",
  },
];

const DEPARTMENTS = [
  "Direction",
  "Writing",
  "Camera & light",
  "Sound",
  "Art & design",
  "Editorial & post",
  "Production office",
];

const MAX_CV_BYTES = 4 * 1024 * 1024;

export default function Production() {
  const [sent, setSent] = useState(false);
  const [kind, setKind] = useState<CareerFields["kind"]>("crew");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");

  const activePath = PATHS.find((p) => p.key === kind) ?? PATHS[0];

  const pickCv = (file: File | null) => {
    setError("");
    if (file && file.size > MAX_CV_BYTES) {
      setCv(null);
      setError("Keep the CV under 4MB.");
      return;
    }
    setCv(file);
  };

  const send = async () => {
    setError("");
    setBusy(true);
    const res = await submitCareer(
      { kind, name, email, discipline, link, message },
      cv,
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
      {/* Hero — same poster language as About (white line, red line, aside). */}
      <section className="abt-hero">
        <span className="caption-label abt-eyebrow">Production</span>
        <h1 className="display abt-hero__title">
          <span className="abt-hero__line">Whatever the story needs,</span>
          <span className="abt-hero__line abt-hero__line--red">
            the house can shoot it.
          </span>
        </h1>
        <p className="projects-hero__lede">
          A full unit under one roof. Features, series, verticals, commercials and
          music videos, from development through delivery.
        </p>
        <span className="script abt-hero__script">lights, camera, everything.</span>
      </section>

      {/* Proof — two stills from the unit. */}
      <section className="prod-stills">
        <Zoomable
          src="/photos/production-01.jpg?v=2"
          alt="Black and white shot of an SUV mid-air, launched off a ramp in a stunt, with a crane truck rigged in the background. Watermarked Production Still 27."
        >
          <figure className="prod-still">
            <img
              src="/photos/production-01.jpg?v=2"
              alt="Black and white shot of an SUV mid-air, launched off a ramp in a stunt, with a crane truck rigged in the background. Watermarked Production Still 27."
            />
          </figure>
        </Zoomable>
        <Zoomable
          src="/photos/production-02.jpg?v=3"
          alt="Black and white shot of two stunt performers flying through a fireball explosion in a street stunt sequence. Watermarked Production Still 36."
        >
          <figure className="prod-still">
            <img
              src="/photos/production-02.jpg?v=3"
              alt="Black and white shot of two stunt performers flying through a fireball explosion in a street stunt sequence. Watermarked Production Still 36."
            />
          </figure>
        </Zoomable>
      </section>

      {/* The unit — open call by department, honest version of a jobs board. */}
      <section className="prod-depts">
        <span className="caption-label abt-eyebrow">The unit</span>
        <p className="prod-depts__lede">
          Productions are spinning up, and the house crews for every department.
          No listings, no gatekeeping. If you're good, we want to know you exist.
        </p>
        <div className="prod-depts__list">
          {DEPARTMENTS.map((d) => (
            <a key={d} href="#join" className="prod-dept">
              <span className="prod-dept__name" data-letter-hover="1">
                {d}
              </span>
              <span className="prod-dept__status">Open call →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Join the house — one form, three paths, optional CV. */}
      <section className="contact-body prod-join" id="join">
        <div className="contact-info">
          <div className="contact-block">
            <CaptionLabel>Join the house</CaptionLabel>
            <p className="contact-block__body">
              Crew for the slate, cast for the stories, creatives for everything the
              house makes next. Tell us who you are and attach your CV — every
              application gets read by a person.
            </p>
            <a
              href="mailto:production@angrytiger.in?subject=Joining%20the%20house"
              className="contact-block__email"
              data-letter-hover="1"
            >
              production@angrytiger.in
            </a>
          </div>
          <div className="contact-block">
            <CaptionLabel>Hiring the house?</CaptionLabel>
            <p className="contact-block__body">
              If you're here to bring us something to shoot instead, that door is on
              the contact page.
            </p>
            <Link href="/contact" className="contact-block__link" data-letter-hover="1">
              Work with the house →
            </Link>
          </div>
        </div>

        <div className="contact-form">
          {!sent ? (
            <div className="contact-form__fields">
              <div className="field">
                <span>I want to</span>
                <div className="contact-type-row">
                  {PATHS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      className={`contact-type${kind === p.key ? " contact-type--active" : ""}`}
                      onClick={() => setKind(p.key)}
                    >
                      {p.label}
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
              <Input
                label="What you do"
                type="text"
                placeholder={activePath.disciplinePlaceholder}
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
              />
              <Input
                label="Reel / portfolio link"
                type="url"
                placeholder="https://"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <Textarea
                label="The details"
                placeholder={activePath.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="field">
                <span>CV (PDF or Word, under 4MB)</span>
                <label className="file-pick">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => pickCv(e.target.files?.[0] ?? null)}
                  />
                  <span className="file-pick__btn">{cv ? "Change file" : "Attach CV"}</span>
                  <span className="file-pick__name">{cv ? cv.name : "Optional"}</span>
                </label>
              </div>
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
              <p className="contact-form__note">
                Every application gets read. If it's a fit, you'll hear from us.
              </p>
              <Turnstile onToken={setCaptcha} />
              {error && <span className="form-error">{error}</span>}
            </div>
          ) : (
            <div className="contact-form__sent">
              <p className="contact-form__sent-title">Received.</p>
              <p className="contact-form__sent-body">
                Your application is in the house. If it's a fit, you'll hear from
                production@angrytiger.in.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
