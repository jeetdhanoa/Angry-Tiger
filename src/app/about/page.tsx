import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import MarkerStroke from "@/components/MarkerStroke";

export const metadata: Metadata = {
  title: "About — Angry Tiger",
  description:
    "Every industry develops a formula. Every generation rewrites it. Angry Tiger is an independent Bollywood production house making feature films, television and vertical series.",
};

// §1.02 of the Brand Guidelines — the five creative principles.
const PRINCIPLES = [
  {
    title: "Creative fearlessness",
    body: "Bold ideas and unconventional thinking. Creative decisions are driven by instinct, confidence and the willingness to challenge familiar approaches in pursuit of work that stands apart.",
  },
  {
    title: "Original thinking",
    body: "Every project begins with curiosity rather than repetition. Fresh perspectives, meaningful concepts and storytelling that feels distinctive instead of predictable.",
  },
  {
    title: "Purposeful craft",
    body: "Every visual and creative decision serves a purpose. Attention to detail, thoughtful execution and strong creative direction keep ideas sharp without losing their original energy.",
  },
  {
    title: "Cultural relevance",
    body: "Stories built with an awareness of people, culture and contemporary language — work that connects authentically and stays memorable long after it is experienced.",
  },
  {
    title: "Constant evolution",
    body: "Built to evolve. New ideas, emerging techniques and creative experimentation are embraced while the identity stays strong and consistent.",
  },
];

const FORMATS = [
  { href: "/films", title: "Films", sub: "Features and short features →" },
  { href: "/television", title: "Television", sub: "Series built to break the pattern →" },
  { href: "/vertical", title: "Vertical", sub: "Series made for how people actually watch →" },
];

export default function About() {
  return (
    <div className="page">
      {/* Hero — the guideline's own billboard lines (§6 Visual Application). */}
      <section className="abt-hero">
        <span className="caption-label">About the house</span>
        <h1 className="display abt-hero__title">
          <span className="abt-hero__line">Every industry develops a formula.</span>
          <span className="abt-hero__line abt-hero__line--red">
            Every generation rewrites it.
          </span>
        </h1>
        {/* The line off the back of the business card. */}
        <span className="script abt-hero__script">
          the path less taken makes better cinema
        </span>
      </section>

      {/* The philosophy (§1.01 + §1.03) — the page's one red panel, with the
          rough AT mark looming behind (§5.02). */}
      <section className="abt-manifesto gfx-disrupt">
        <span className="gfx-disrupt__mark abt-manifesto__mark" aria-hidden="true" />
        <span className="caption-label">The philosophy</span>
        <p className="abt-manifesto__lede">
          Angry Tiger is an independent Bollywood Production House built around{" "}
          <MarkerStroke variant="underline" weight={4} color="var(--at-black)">
            fearless
          </MarkerStroke>{" "}
          ideas and original voices — work that feels fresh, unexpected, and impossible
          to ignore.
        </p>
        <p className="abt-manifesto__body">
          Every industry eventually develops a formula. Familiar ideas become safe,
          trends become predictable, and originality begins to disappear. Angry Tiger
          exists to challenge that pattern.
        </p>
        <p className="abt-manifesto__body">
          Memorable work comes from questioning convention, embracing unexpected
          perspectives, and having the confidence to create something different —
          stories that leave a lasting cultural impression, made for audiences who
          deserve better than more of the same.
        </p>
      </section>

      {/* What we make — the same row language as the home page. */}
      <section className="home-rows">
        <div className="home-rows__label">
          <span className="caption-label">What we make</span>
        </div>
        {FORMATS.map((f) => (
          <Link key={f.href} href={f.href} className="home-row">
            <span className="home-row__title" data-letter-hover="1">
              {f.title}
            </span>
            <span className="home-row__sub">{f.sub}</span>
          </Link>
        ))}
      </section>

      {/* Creative principles (§1.02) — a numbered editorial list. */}
      <section className="abt-principles">
        <span className="caption-label">Creative principles</span>
        <div className="abt-principles__list">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className="abt-principle">
              <span className="abt-principle__n">{String(i + 1).padStart(2, "0")}</span>
              <div className="abt-principle__text">
                <h3 className="display" data-letter-hover="1">
                  {p.title}
                  <span className="red-period">.</span>
                </h3>
                <p>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing — the guideline's closing card: statement, tiger, contact. */}
      <section className="abt-close">
        <span className="caption-label">The house</span>
        <h2 className="display abt-close__line">
          The most memorable stories begin with fearless ideas.
        </h2>
        <div className="abt-close__row">
          <a href="mailto:hello@angrytiger.in" className="abt-close__mail" data-letter-hover="1">
            Talk to the tiger →
          </a>
          <span className="abt-close__meta">
            Independent since 2026 · Angry Tiger Production House
          </span>
        </div>
        <img src="/logos/at-brand-symbol-red.svg" alt="" className="abt-close__tiger" />
      </section>

      <Footer />
    </div>
  );
}
