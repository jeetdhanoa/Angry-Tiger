import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import MarkerStroke from "@/components/MarkerStroke";
import Zoomable from "@/components/Zoomable";

export const metadata: Metadata = {
  title: "About — Angry Tiger",
  description:
    "Built on instinct. Refined through craft. Angry Tiger is an independent Bollywood production house making feature films, television and vertical series.",
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
    body: "Stories built with an awareness of people, culture and contemporary language. Work that connects authentically and stays memorable long after it is experienced.",
  },
  {
    title: "Constant evolution",
    body: "Built to evolve. New ideas, emerging techniques and creative experimentation are embraced while the identity stays strong and consistent.",
  },
];

export default function About() {
  return (
    <main className="page" id="main-content">
      {/* Hero — the guideline's own typography-spread line (§4.05), swapped in
          for the billboard copy (§6): "every generation rewrites it" read as
          dismissive of the industry's experienced people, which isn't the
          point we want to make. This line honours craft instead. */}
      <section className="abt-hero" data-seq>
        <span className="caption-label abt-eyebrow">About the house</span>
        <h1 className="display abt-hero__title">
          <span className="abt-hero__line">Built on instinct.</span>
          <span className="abt-hero__line abt-hero__line--red">Refined through craft.</span>
        </h1>
        {/* The line off the back of the business card. */}
        <span className="script abt-hero__script">
          the path less taken makes better cinema
        </span>
      </section>

      {/* On-set proof — a full-bleed still, dropped in above the philosophy.
          Opens as a film frame when it scrolls in. */}
      <section className="abt-photo" data-seq>
        <Zoomable
          src="/photos/about-story.jpg?v=3"
          alt="Black and white shot of a jib crane rigged on a city courtyard set, crew gathered around monitors and lighting stands. Watermarked Production Still 18."
          revealFrame
        >
          <figure className="prod-still">
            <Image
              src="/photos/about-story.jpg?v=3"
              alt="Black and white shot of a jib crane rigged on a city courtyard set, crew gathered around monitors and lighting stands. Watermarked Production Still 18."
              fill
              sizes="100vw"
            />
          </figure>
        </Zoomable>
      </section>

      {/* The philosophy (§1.01 + §1.03) — the page's one red panel, with the
          rough AT mark looming behind (§5.02). */}
      <section className="abt-manifesto gfx-disrupt" data-seq>
        <span className="gfx-disrupt__mark abt-manifesto__mark" aria-hidden="true" />
        <span className="caption-label abt-eyebrow">The philosophy</span>
        <p className="abt-manifesto__lede">
          Angry Tiger is an independent Bollywood Production House built around{" "}
          <MarkerStroke variant="underline" weight={4} color="var(--at-black)">
            fearless
          </MarkerStroke>{" "}
          ideas and original voices. It exists to create work that feels fresh,
          unexpected, and impossible to ignore.
        </p>
        <p className="abt-manifesto__body">
          Every industry eventually develops a formula. Familiar ideas become safe,
          trends become predictable, and originality begins to disappear. Angry Tiger
          exists to challenge that pattern.
        </p>
        <p className="abt-manifesto__body">
          Memorable work comes from questioning convention, embracing unexpected
          perspectives, and having the confidence to create something different. These
          are the stories that leave a lasting cultural impression, made for audiences
          who deserve better than more of the same.
        </p>
      </section>

      {/* Creative principles (§1.02) — a numbered editorial list. */}
      <section className="abt-principles">
        <span className="caption-label abt-eyebrow" data-reveal>
          Creative principles
        </span>
        {/* Each principle rises in turn as you read down the column. */}
        <div className="abt-principles__list" data-seq>
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

      {/* Closing — the guideline's closing card: statement, lockup, contact. */}
      <section className="abt-close" data-seq>
        <span className="caption-label abt-eyebrow">The house</span>
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
        {/* The Stacked Wordmark, black — a different mark from the lockup
            (Home) or the brand symbol (nav/footer/404/splash); never used
            anywhere else on the site. */}
        <img
          src="/logos/at-stacked-wordmark-black.svg"
          alt="Angry Tiger"
          className="abt-close__logo"
        />
      </section>

      <Footer />
    </main>
  );
}
