import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import MarkerStroke from "@/components/MarkerStroke";

export const metadata: Metadata = {
  title: "Projects — Angry Tiger",
  description:
    "Our first slate is in development. New Angry Tiger projects get announced here first.",
};

// The first slate, classified. Formats are real; everything else stays
// under the bar until announcement day.
const SLATES = [
  { code: "001", format: "Feature film", titleBar: "min(340px, 60vw)", genreBar: 72 },
  { code: "002", format: "Vertical series", titleBar: "min(260px, 48vw)", genreBar: 96 },
  { code: "003", format: "Web series", titleBar: "min(300px, 54vw)", genreBar: 58 },
];

export default function Projects() {
  return (
    <div className="page">
      <section className="projects-hero">
        <span className="caption-label">Projects</span>
        <h1 className="display" data-parallax="0.1">
          Coming <MarkerStroke variant="underline" weight={4}>soon</MarkerStroke>.
        </h1>
        <p className="projects-hero__lede">
          Our first slate is in development. No titles yet. New projects get announced
          here first.
        </p>
        <div className="projects-hero__actions">
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Send us your story
            </Button>
          </Link>
          <Link href="/membership">
            <Button variant="secondary" size="lg">
              Join The Ambush
            </Button>
          </Link>
        </div>
      </section>

      <section className="slate gfx-disrupt">
        <span className="gfx-disrupt__mark slate__mark" aria-hidden="true" />
        <span className="caption-label">The slate · Eyes only</span>
        <div className="slate__list">
          {SLATES.map((s) => (
            <div key={s.code} className="slate-row">
              <div className="slate-row__head">
                <span className="slate-row__code">Slate {s.code}</span>
                <span className="slate-row__status">Status: In development</span>
              </div>
              <span
                className="redact"
                style={{ width: s.titleBar }}
                aria-label="Title withheld"
              />
              <div className="slate-row__specs">
                <span>Format: {s.format}</span>
                <span>
                  Genre: <span className="redact--inline" style={{ width: s.genreBar }} />
                </span>
                <span>
                  Director: <span className="redact--inline" style={{ width: 84 }} />
                </span>
                <span>
                  Logline: <span className="redact--inline" style={{ width: 140 }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
