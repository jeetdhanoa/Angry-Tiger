import Link from "next/link";
import Footer from "@/components/Footer";
import MarkerStroke from "@/components/MarkerStroke";
import Zoomable from "@/components/Zoomable";

export default function Home() {
  return (
    <div className="page">
      <section className="home-hero">
        <img
          className="home-hero__logo"
          data-parallax="0.12"
          src="/logos/at-primary-lockup-white.svg"
          alt="Angry Tiger"
        />
      </section>

      <section className="home-story">
        <Zoomable
          src="/photos/home-story.jpg?v=5"
          alt="Black and white shot of a camera crew on the back of a tracking truck, three cinema cameras rigged side by side under an umbrella"
        >
          <div className="home-story__photo">
            <img
              src="/photos/home-story.jpg?v=5"
              alt="Black and white shot of a camera crew on the back of a tracking truck, three cinema cameras rigged side by side under an umbrella"
              className="home-story__img"
            />
            <span className="home-story__caption">Production Still 09</span>
            <img
              src="/logos/at-brand-symbol-red.svg"
              alt=""
              aria-hidden="true"
              className="photo-mark"
            />
          </div>
        </Zoomable>
        <div className="home-story__panel">
          {/* §5.03 Expressive Marks — highlight the word the whole brand turns on.
              Black on the red panel (red-on-red would be invisible). */}
          <h2 className="display">
            Don&apos;t follow the{" "}
            <MarkerStroke variant="strike" color="var(--at-black)" scrub>
              formula
            </MarkerStroke>
            .
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

      {/* §5.02 Intentional Disruption — an oversized rough mark breaks the grid behind the rows. */}
      <section className="home-rows gfx-disrupt">
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
    </div>
  );
}
