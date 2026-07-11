import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import MarkerStroke from "@/components/MarkerStroke";
import Illustration from "@/components/Illustration";

export const metadata: Metadata = {
  title: "About — Angry Tiger",
  description:
    "Every memorable story begins with a fearless idea. Angry Tiger is an independent Bollywood production house making feature films, television and vertical series.",
};

// §1.02 of the Brand Guidelines — the five creative principles, verbatim.
const PRINCIPLES = [
  {
    title: "Creative fearlessness",
    body: "We embrace bold ideas and unconventional thinking. Creative decisions are driven by instinct, confidence and the willingness to challenge familiar approaches in pursuit of work that stands apart.",
  },
  {
    title: "Original thinking",
    body: "Every project begins with curiosity rather than repetition. We value fresh perspectives, meaningful concepts and storytelling that feels distinctive instead of predictable.",
  },
  {
    title: "Purposeful craft",
    body: "Every visual and creative decision serves a purpose. Attention to detail, thoughtful execution and strong creative direction ensure ideas are refined without losing their original energy.",
  },
  {
    title: "Cultural relevance",
    body: "Stories are created with an awareness of people, culture and contemporary visual language — work that connects authentically and stays memorable long after it is experienced.",
  },
  {
    title: "Constant evolution",
    body: "Angry Tiger is built to evolve. New ideas, emerging techniques and creative experimentation are embraced while keeping a strong and consistent identity.",
  },
];

export default function About() {
  return (
    <div className="page">
      {/* §1.01 — the brand's opening statement, as the page's poster line. */}
      <section className="about-hero">
        <span className="caption-label">About</span>
        <h1 className="display" data-parallax="0.1">
          Every memorable story begins with a{" "}
          <MarkerStroke variant="underline" weight={4}>
            fearless
          </MarkerStroke>{" "}
          idea.
        </h1>
      </section>

      {/* §1.03 — the philosophy, alongside the on-set photography slot. */}
      <section className="about-body">
        <div className="about-copy">
          <p className="about-copy__lede">
            Angry Tiger is an independent Bollywood Production House built around bold
            ideas and original voices. We make Feature Films, Television and Vertical
            Series that feel fresh, unexpected, and impossible to ignore.
          </p>
          <p className="about-copy__body">
            Every industry eventually develops a formula. Familiar ideas become safe,
            trends become predictable, and originality begins to disappear. Angry Tiger
            exists to challenge that pattern — we believe memorable work comes from
            questioning convention, embracing unexpected perspectives, and having the
            confidence to create something different.
          </p>
          <p className="about-copy__body">
            Rather than decorating the work, every choice reinforces one idea: break the
            formula, and put stories in front of audiences who deserve better than more
            of the same.
          </p>
          <div className="about-facts">
            <div className="about-fact">
              <span className="about-fact__label">Founded</span>
              <span>2026</span>
            </div>
            <div className="about-fact">
              <span className="about-fact__label">Makes</span>
              <span>Feature Films · Television · Vertical Series</span>
            </div>
            <div className="about-fact">
              <span className="about-fact__label">Reach us</span>
              <a href="mailto:hello@angrytiger.in" data-letter-hover="1">
                hello@angrytiger.in
              </a>
            </div>
          </div>
        </div>
        <div className="about-photo">
          <div className="about-photo__frame">
            <ImageSlot scene="On set" shot="003" />
          </div>
          <div className="about-photo__caption">
            <span className="about-photo__caption-label">
              On set. A range of voices, on and off screen
            </span>
            <span className="about-photo__script">the work speaks</span>
          </div>
        </div>
      </section>

      {/* §1.02 — the five creative principles on the page's one red panel. */}
      <section className="about-believe">
        <Illustration
          name="umbrella"
          width={200}
          color="var(--at-black)"
          className="about-believe__glyph"
        />
        <span className="caption-label">Creative principles</span>
        <div className="about-believe__grid">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="about-believe__col">
              <h3 className="display" data-letter-hover="1">
                {p.title}.
              </h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
