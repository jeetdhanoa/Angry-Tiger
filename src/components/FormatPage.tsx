import Link from "next/link";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export type Slate = { code: string; titleBar: string; genreBar: number };
export type SlateGroup = { label: string; slates: Slate[] };

// Shared layout for the format landing pages (Films / Television / Vertical).
// No titles are public yet, so each page presents in-development "eyes only"
// slates — the redacted device the old Projects page used — with the rough
// tiger looming behind them (§5.02). Films carries two groups (Features and
// Short films); Television and Vertical carry one.
export default function FormatPage({
  eyebrow,
  heading,
  lede,
  groups,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  groups: SlateGroup[];
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
        {groups.map((group) => (
          <div key={group.label} className="slate__group">
            <span className="caption-label">{group.label} · Eyes only</span>
            <div className="slate__list">
              {group.slates.map((s) => (
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
                      Genre:{" "}
                      <span className="redact--inline" style={{ width: s.genreBar }} />
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
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
