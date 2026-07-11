"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Turnstile from "@/components/Turnstile";
import MarkerStroke from "@/components/MarkerStroke";
import Illustration from "@/components/Illustration";
import { joinWaitlist } from "@/lib/submissions";

// Design props carried over from the prototype.
const PRICE = "₹999";
const CARD_NUMBER = "001";

const PERKS = [
  {
    title: "First screenings",
    body: "Invites to member screenings before the public hears about them.",
  },
  { title: "Members-only drops", body: "Shop items that never reach the open shelf." },
  { title: "Member pricing", body: "Lower prices and free shipping on every order." },
  {
    title: "First announcements",
    body: "New titles land in your inbox before anywhere else.",
  },
  {
    title: "The room",
    body: "A voice in what gets made next. Members hear our plans first.",
  },
  {
    title: "The card",
    body: "Numbered from 001. Founding members keep their number for life.",
  },
];

const FAQS = [
  {
    q: "When does it open?",
    a: "The Ambush opens alongside our first release. Waitlist members get invited first, in order of signup.",
  },
  {
    q: "What does it cost?",
    a: `${PRICE} a month. Founding members lock that price for life.`,
  },
  {
    q: "What do I get on day one?",
    a: "Your numbered card, member pricing in the shop, and first invites to screenings.",
  },
  {
    q: "Can I gift a membership?",
    a: "Yes. Gifting opens with the program. Details closer to launch.",
  },
];

export default function Membership() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(-1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [position, setPosition] = useState<number | null>(null);

  const join = async () => {
    setError("");
    setBusy(true);
    const res = await joinWaitlist(email, { website: hp, captchaToken: captcha });
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "That didn't go through.");
      return;
    }
    setPosition(res.position ?? null);
    setJoined(true);
  };

  return (
    <div className="page">
      <section className="mem-hero">
        <span className="caption-label">Membership · Coming soon</span>
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          The <span className="red-period">Ambush.</span>
        </h1>
        <p className="mem-hero__lede">
          Your all-access pass to all things Angry Tiger. Screenings, drops, and a say in
          what gets made.
        </p>
        <div className="mem-hero__price-row">
          <span className="mem-hero__price">{PRICE} a month</span>
          <span className="mem-hero__script">a group of tigers is called an ambush</span>
        </div>
      </section>

      <section className="mem-card-split">
        <div className="mem-card-stage">
          <div className="mem-card">
            <span className="mem-card__title">The Ambush.</span>
            <div className="mem-card__mark">
              <img src="/logos/at-brand-symbol-red.svg" alt="" />
            </div>
            <div className="mem-card__foot">
              <span className="mem-card__number">Founding member Nº {CARD_NUMBER}</span>
              <img src="/logos/at-primary-wordmark-white.svg" alt="Angry Tiger" />
            </div>
          </div>
        </div>
        <div className="mem-card-copy">
          <h2 className="display" data-letter-hover="1">
            The card.
          </h2>
          <p>
            Founding members are numbered from 001. The card gets you into member
            screenings and unlocks member pricing everywhere we sell.
          </p>
        </div>
      </section>

      <section className="mem-perks">
        {/* §5.04 Illustrative Language — take a seat; a voice in the room. */}
        <Illustration name="chair-office" width={168} className="mem-perks__glyph" />
        <h2 className="display" data-letter-hover="1">
          What you get.
        </h2>
        <div className="mem-perks__list">
          {PERKS.map((perk) => (
            <div key={perk.title} className="mem-perk">
              <span className="mem-perk__title">{perk.title}</span>
              <span className="mem-perk__body">{perk.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mem-cta">
        <div className="mem-cta__copy">
          <h2 className="display">
            Get in <MarkerStroke variant="underline" weight={4}>early</MarkerStroke>.
          </h2>
          <p>
            The Ambush opens alongside our first release. The waitlist is open now.
            Founding members go first.
          </p>
        </div>
        <div>
          {!joined ? (
            <div className="mem-cta__form">
              <input
                type="email"
                className="input-dark"
                placeholder="your@email.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") join();
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
              <Button variant="secondary" size="md" onClick={join} disabled={busy}>
                {busy ? "Joining…" : "Join the waitlist"}
              </Button>
              <Turnstile onToken={setCaptcha} />
              {error && <span className="form-error">{error}</span>}
            </div>
          ) : (
            <p className="mem-cta__joined">
              You&apos;re in The Ambush.
              {position !== null && (
                <span className="mem-cta__joined-number">
                  Nº {String(position).padStart(3, "0")} in line
                </span>
              )}
              <span className="mem-cta__joined-sub">
                Founding members go first. Watch your inbox.
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="mem-faq">
        <h2 className="display" data-letter-hover="1">
          Questions.
        </h2>
        <div className="mem-faq__list">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="mem-faq__item">
              <button
                type="button"
                className="mem-faq__q"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="mem-faq__q-text">{faq.q}</span>
                <span className="mem-faq__mark">{open === i ? "×" : "+"}</span>
              </button>
              {open === i && (
                <div className="mem-faq__a">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
