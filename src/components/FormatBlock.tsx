export type Slate = { code: string; titleBar: string; genreBar: number };

// One section of a format page: a headline + lede, then its in-development
// redacted slate with the rough tiger behind it (§5.02). Pages compose one or
// more of these. The first block on a page uses `full` (the tall centred hero +
// h1 with the top-of-page parallax); stacked blocks below get a top-aligned
// hero + h2 with a bounded, viewport-relative parallax so several sections read
// as one page without the headline drifting over the copy.
export default function FormatBlock({
  heading,
  lede,
  slates,
  full = false,
}: {
  heading: string;
  lede: string;
  slates: Slate[];
  full?: boolean;
}) {
  return (
    <>
      <section className={full ? "projects-hero format-hero" : "format-stack"}>
        {full ? (
          <h1 className="display" data-parallax="0.1" data-letter-hover>
            {heading}
          </h1>
        ) : (
          <h2 className="display" data-letter-hover>
            {heading}
          </h2>
        )}
        <p className="projects-hero__lede">{lede}</p>
      </section>

      <section className="slate gfx-disrupt">
        <span className="gfx-disrupt__mark slate__mark" aria-hidden="true" />
        {/* Classified rows lay themselves out one by one, like case files. */}
        <div className="slate__list" data-seq>
          {slates.map((s) => (
            <div key={s.code} className="slate-row">
              <div className="slate-row__head">
                <span className="slate-row__code">Slate {s.code}</span>
                <span className="slate-row__status">Status: In development</span>
              </div>
              {/* role="img" is what actually makes aria-label announce on a
                  generic element — without it a screen reader skips these
                  bars entirely and the classified slate reads as blank. */}
              <span
                className="redact"
                style={{ width: s.titleBar }}
                role="img"
                aria-label="Title withheld"
              />
              <div className="slate-row__specs">
                <span>
                  Genre:{" "}
                  <span
                    className="redact--inline"
                    style={{ width: s.genreBar }}
                    role="img"
                    aria-label="withheld"
                  />
                </span>
                <span>
                  Director:{" "}
                  <span
                    className="redact--inline"
                    style={{ width: 84 }}
                    role="img"
                    aria-label="withheld"
                  />
                </span>
                <span>
                  Logline:{" "}
                  <span
                    className="redact--inline"
                    style={{ width: 140 }}
                    role="img"
                    aria-label="withheld"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
