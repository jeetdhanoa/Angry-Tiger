import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export type Slate = { code: string; titleBar: string; genreBar: number };

// Shared layout for the format landing pages (Films / Television / Vertical).
// No titles are public yet, so each page presents an in-development "eyes only"
// slate — the same redacted device the old Projects page used — with the rough
// tiger looming behind it (§5.02).
export default function FormatPage({
  eyebrow,
  heading,
  lede,
  slates,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  slates: Slate[];
}) {
  return (
    <div className="page">
      <section className="projects-hero">
        <span className="caption-label">{eyebrow}</span>
        <h1 className="display" data-parallax="0.1" data-letter-hover>
          {heading}
        </h1>
        <p className="projects-hero__lede">{lede}</p>
        <div className="projects-hero__actions">
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Send us your story
            </Button>
          </Link>
        </div>
      </section>

      <section className="slate gfx-disrupt">
        <span className="gfx-disrupt__mark slate__mark" aria-hidden="true" />
        <span className="caption-label">The slate · Eyes only</span>
        <div className="slate__list">
          {slates.map((s) => (
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
