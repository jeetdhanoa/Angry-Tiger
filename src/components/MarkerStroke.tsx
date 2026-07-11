import { markerStrokes, type MarkerStrokeName } from "@/design/graphics";

/**
 * §5.03 Expressive Marks — a rough, hand-drawn marker stroke used to
 * *highlight* type, not decorate it (guideline: "Use them to highlight rather
 * than decorate", "Keep marks imperfect and expressive"). Wrap the word(s) to
 * emphasise:
 *
 *   Don&apos;t follow the <MarkerStroke>formula</MarkerStroke>.
 *
 * The stroke is an inline SVG overlaid on the text, stretched to fit via
 * preserveAspectRatio="none"; `vector-effect: non-scaling-stroke` keeps the
 * line weight even however wide the word runs. Signal Red by default. Drawn
 * solid by default — pass `scrub` only where the stroke should tie to scroll
 * position (the Home page's "formula"); every other instance just renders.
 */
export default function MarkerStroke({
  children,
  variant = "underline",
  color = "var(--at-red)",
  weight = 6,
  scrub = false,
  className = "",
}: {
  children: React.ReactNode;
  variant?: MarkerStrokeName;
  color?: string;
  /** Stroke weight in px (kept constant regardless of word width). */
  weight?: number;
  /** Tie the draw progress to scroll position instead of rendering solid. */
  scrub?: boolean;
  className?: string;
}) {
  const d = markerStrokes[variant];
  return (
    <span
      className={`marker marker--${variant} ${className}`.trim()}
      data-marker-scrub={scrub ? "1" : undefined}
    >
      <span className="marker__text">{children}</span>
      <svg
        className="marker__stroke"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        style={{ color }}
      >
        <path
          d={d}
          stroke="currentColor"
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
        />
      </svg>
    </span>
  );
}
