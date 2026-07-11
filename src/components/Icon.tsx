import { icons, type IconName } from "@/design/icons";

/** Renders any icon from the design/icons.ts registry. Stroke-only,
 *  currentColor, matching the nav's existing icon language. */
export default function Icon({
  name,
  size = 22,
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const icon = icons[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      {icon.paths.map((p, i) =>
        p.type === "circle" ? (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
        ) : p.type === "line" ? (
          <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} />
        ) : (
          <path key={i} d={p.d} />
        )
      )}
    </svg>
  );
}
