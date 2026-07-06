import Link from "next/link";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";

export default function Home() {
  return (
    <div className="page">
      <section className="home-hero">
        <img
          className="home-hero__logo"
          data-parallax="0.12"
          src="/logos/at-primary-lockup-white.png"
          alt="Angry Tiger"
        />
      </section>

      <section className="home-story">
        <div className="home-story__photo">
          <ImageSlot placeholder="Drop a production still, a wide range of people on and off screen" />
        </div>
        <div className="home-story__panel">
          <h2 className="display" data-letter-hover>
            Don&apos;t follow the formula.
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

      <section className="home-rows">
        <div className="home-rows__label">
          <span className="caption-label">Coming soon</span>
        </div>
        <Link href="/projects" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            Projects
          </span>
          <span className="home-row__sub">The first slate is in development →</span>
        </Link>
        <Link href="/shop" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            The shop
          </span>
          <span className="home-row__sub">Drop 001, opens with our first release →</span>
        </Link>
        <Link href="/membership" className="home-row">
          <span className="home-row__title" data-letter-hover="1">
            The Ambush
          </span>
          <span className="home-row__sub">Membership, first looks and first drops →</span>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
