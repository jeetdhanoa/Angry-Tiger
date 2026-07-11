import { illustrations, type IllustrationName } from "@/design/graphics";

/**
 * §5.04 Illustrative Language — renders one of the brand's hand-drawn objects
 * (chair, matchstick, umbrella) in a core-palette colour. The source SVG is a
 * black silhouette; we use it as a `mask` so the shape can be painted any
 * brand colour (Signal Red by default) without touching the asset.
 *
 * Decorative by default (aria-hidden). Pass `label` to expose it to assistive
 * tech when the illustration carries meaning on its own.
 */
export default function Illustration({
  name,
  width = 160,
  color = "var(--at-red)",
  rotate = 0,
  className = "",
  label,
  style,
}: {
  name: IllustrationName;
  /** Rendered width in px; height follows the asset's aspect ratio. */
  width?: number;
  /** Any CSS colour; defaults to Signal Red. */
  color?: string;
  /** Degrees of tilt — a little rotation reads as hand-placed, not aligned. */
  rotate?: number;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  const illo = illustrations[name];
  return (
    <span
      className={`illustration ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={
        {
          "--illo-src": `url("${illo.src}")`,
          "--illo-color": color,
          width: `${width}px`,
          height: `${Math.round(width / illo.ratio)}px`,
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}
