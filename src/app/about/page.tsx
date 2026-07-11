import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import MarkerStroke from "@/components/MarkerStroke";
import Illustration from "@/components/Illustration";

export const metadata: Metadata = {
  title: "About — Angry Tiger",
  description:
    "Built to break the pattern. Angry Tiger is an independent Bollywood production house making feature films, web series and vertical series.",
};

export default function About() {
  return (
    <div className="page page--paper">
      <section className="about-hero">
        <span className="caption-label">About</span>
        <h1 className="display" data-parallax="0.1">
          Built to break the{" "}
          <MarkerStroke variant="underline" weight={4}>pattern</MarkerStroke>.
        </h1>
      </section>

      <section className="about-body">
        <div className="about-copy">
          <p className="about-copy__lede">
            Angry Tiger is an independent Bollywood Production House. We make Feature
            Films, Web Series and Vertical Series for Indian audiences across every
            demographic.
          </p>
          <p className="about-copy__body">
            We are not interested in making more of the same. The most memorable stories
            begin with fearless ideas. We exist to find those ideas, back the voices
            behind them, and put them in front of audiences who deserve better.
          </p>
          <div className="about-facts">
            <div className="about-fact">
              <span className="about-fact__label">Founded</span>
              <span>2026</span>
            </div>
            <div className="about-fact">
              <span className="about-fact__label">Makes</span>
              <span>Feature Films · Web Series · Vertical Series</span>
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

      <section className="about-believe">
        {/* §5.04 Illustrative Language — a hand-drawn object, bold red on black. */}
        <Illustration name="umbrella" width={200} className="about-believe__glyph" />
        <span className="caption-label">What we believe</span>
        <div className="about-believe__grid">
          <div className="about-believe__col">
            <h3 className="display" data-letter-hover="1">
              Original over familiar<span className="red-period">.</span>
            </h3>
            <p>We chase the idea no one has made yet, not the one that already worked.</p>
          </div>
          <div className="about-believe__col">
            <h3 className="display" data-letter-hover="1">
              The story leads<span className="red-period">.</span>
            </h3>
            <p>Not the star, not the formula. The story decides everything else.</p>
          </div>
          <div className="about-believe__col">
            <h3 className="display" data-letter-hover="1">
              For every audience<span className="red-period">.</span>
            </h3>
            <p>Across every demographic. For anyone tired of more of the same.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
