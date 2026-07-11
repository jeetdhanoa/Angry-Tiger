import Link from "next/link";
import Button from "@/components/Button";

export type Slate = { code: string; titleBar: string; genreBar: number };

// One section of a format page: a hero (eyebrow + heading + lede, optional CTA)
// followed by its in-development redacted slate with the rough tiger behind it
// (§5.02). Pages compose one or more of these. The first block on a page uses
// `full` (the tall centred hero + h1); stacked blocks below get a top-aligned
// hero + h2 so several sections read as one page.
export default function FormatBlock({
  eyebrow,
  heading,
  lede,
  slates,
  full = false,
  cta = false,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  slates: Slate[];
  full?: boolean;
  cta?: boolean;
}) {
  return (
    <>
      <section className={full ? "projects-hero" : "format-stack"}>
        <span className="caption-label">{eyebrow}</span>
        {full ? (
          // Parallax only on the tall hero — on a stacked section it drifts the
          // headline down over the description below it.
          <h1 className="display" data-parallax="0.1" data-letter-hover>
            {heading}
          </h1>
        ) : (
          <h2 className="display" data-letter-hover>
            {heading}
          </h2>
        )}
        <p className="projects-hero__lede">{lede}</p>
        {cta && (
          <div className="projects-hero__actions">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Send us your story
              </Button>
            </Link>
          </div>
        )}
      </section>

      <section className="slate gfx-disrupt">
        <span className="gfx-disrupt__mark slate__mark" aria-hidden="true" />
        <span className="caption-label">The slate</span>
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
    </>
  );
}
