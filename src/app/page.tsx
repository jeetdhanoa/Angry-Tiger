import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import MarkerStroke from "@/components/MarkerStroke";
import Zoomable from "@/components/Zoomable";

export default function Home() {
  return (
    <main className="page" id="main-content">
      <section className="home-hero" data-no-reveal>
        {/* The visible "heading" here is the wordmark graphic below — this
            gives the page a real <h1> for screen readers/SEO without
            duplicating it visually. The logo carries its own film-frame
            open (see .home-hero__logo), so the section opts out of the
            generic reveal to avoid stacking two entrances. */}
        <h1 className="visually-hidden">
          Angry Tiger — an independent production house. Don&apos;t follow the formula.
        </h1>
        <img
          className="home-hero__logo"
          data-parallax="0.12"
          src="/logos/at-primary-lockup-white.svg"
          alt="Angry Tiger"
        />
      </section>

      {/* Sequenced: the still opens as a film frame, then the panel rises in. */}
      <section className="home-story" data-seq>
        <Zoomable
          src="/photos/home-story.jpg?v=7"
          alt="Black and white shot of a camera crew on the back of a tracking truck, three cinema cameras rigged side by side under an umbrella. Watermarked Production Still 09."
          revealFrame
        >
          <div className="home-story__photo">
            <Image
              src="/photos/home-story.jpg?v=7"
              alt="Black and white shot of a camera crew on the back of a tracking truck, three cinema cameras rigged side by side under an umbrella. Watermarked Production Still 09."
              className="home-story__img"
              fill
              sizes="(max-width: 719px) 100vw, 60vw"
              priority
            />
          </div>
        </Zoomable>
        <div className="home-story__panel">
          {/* §5.03 Expressive Marks — highlight the word the whole brand turns on.
              Black on the red panel (red-on-red would be invisible). */}
          <h2 className="display">
            Don&apos;t follow the{" "}
            {/* nowrap keeps the full stop glued to the word — a break
                opportunity exists after MarkerStroke's inline-block, and at
                some widths the period wrapped onto a line of its own. */}
            <span style={{ whiteSpace: "nowrap" }}>
              <MarkerStroke variant="strike" color="var(--at-black)" scrub>
                formula
              </MarkerStroke>
              .
            </span>
          </h2>
          <p>
            Angry Tiger is a Production House for Feature Films, Web Series and Vertical
            Series, built for audiences of every demographic who deserve better than more
            of the same. Independent since 2026.
          </p>
          <Link href="/about" className="home-story__link">
            <span data-letter-hover="1">About the house →</span>
          </Link>
        </div>
      </section>

      {/* §5.02 Intentional Disruption — an oversized rough mark breaks the grid behind the rows.
          Sequenced so the label and the three rows arrive one after another. */}
      <section className="home-rows gfx-disrupt" data-seq>
        <span className="gfx-disrupt__mark home-rows__mark" aria-hidden="true" />
        <div className="home-rows__label">
          <span className="caption-label">Coming soon</span>
        </div>
        <Link href="/films" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            Films
          </span>
          <span className="home-row__sub">Feature films. The first slate is in development →</span>
        </Link>
        <Link href="/television" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            Television
          </span>
          <span className="home-row__sub">Series built to break the pattern →</span>
        </Link>
        <Link href="/vertical" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            Vertical
          </span>
          <span className="home-row__sub">Vertical series, made for how people watch →</span>
        </Link>
      </section>

      <Footer />
    </main>
  );
}
