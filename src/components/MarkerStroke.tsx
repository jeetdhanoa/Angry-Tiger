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
 * line weight even however wide the word runs. Signal Red by default.
 */
export default function MarkerStroke({
  children,
  variant = "underline",
  color = "var(--at-red)",
  weight = 6,
  className = "",
}: {
  children: React.ReactNode;
  variant?: MarkerStrokeName;
  color?: string;
  /** Stroke weight in px (kept constant regardless of word width). */
  weight?: number;
  className?: string;
}) {
  const d = markerStrokes[variant];
  return (
    <span className={`marker marker--${variant} ${className}`.trim()}>
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
