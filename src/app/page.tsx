import Link from "next/link";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import Intervention from "@/components/Intervention";
import Illustration from "@/components/Illustration";
import MarkerStroke from "@/components/MarkerStroke";

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
        {/* §5.05 Illustrative Intervention — a bold red mark over the B&W still. */}
        <div className="home-story__photo">
          <Intervention align="left">
            <ImageSlot scene="The house" shot="001" />
          </Intervention>
        </div>
        <div className="home-story__panel">
          {/* §5.03 Expressive Marks — highlight the word the whole brand turns on. */}
          <h2 className="display">
            Don&apos;t follow the{" "}
            <MarkerStroke variant="strike">formula</MarkerStroke>.
          </h2>
          <p>
            Angry Tiger is a Production House for Feature Films, Web Series and Vertical
            Series, built for audiences of every demographic who deserve better than more
            of the same. Independent since 2026.
          </p>
          <Link href="/about" className="home-story__link">
            <span data-letter-hover="1">About the house →</span>
          </Link>
          {/* §5.04 Illustrative Language — a hand-drawn object, black on the red panel. */}
          <Illustration
            name="matchstick"
            width={132}
            color="var(--at-black)"
            rotate={-6}
            className="home-story__glyph"
          />
        </div>
      </section>

      {/* §5.02 Intentional Disruption — an oversized rough mark breaks the grid behind the rows. */}
      <section className="home-rows gfx-disrupt">
        <span className="gfx-disrupt__mark home-rows__mark" aria-hidden="true" />
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
