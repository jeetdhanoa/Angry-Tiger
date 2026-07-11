/**
 * §5.05 Illustrative Intervention — existing imagery becomes part of the
 * identity through a bold red graphic that "exaggerates, obscures or
 * reconstructs" it and "becomes the focal point" (guideline). The photography
 * sits underneath in black-and-white; the red mark on top is the only colour.
 *
 * Wrap any imagery (an <img>, an <ImageSlot/>, a photo div):
 *
 *   <Intervention>{"<ImageSlot ... />"}</Intervention>            // default rough red bar
 *   <Intervention overlay={<Illustration name="chair-office" />}> // red object over B&W
 *     {"<img ... />"}
 *   </Intervention>
 */

/** A rough, hand-painted vertical brushstroke — torn ends, wobbly edges. */
const BRUSH_BAR =
  "M56,6 C47,70 61,132 51,196 C43,258 63,318 49,378 C47,392 63,398 71,394 " +
  "C82,340 70,286 80,222 C88,166 74,108 82,52 C85,30 76,12 66,8 Z";

export default function Intervention({
  children,
  overlay,
  align = "center",
  bw = true,
  className = "",
}: {
  /** The imagery to intervene on. */
  children: React.ReactNode;
  /** Optional red element (e.g. an <Illustration/>) to use instead of the bar. */
  overlay?: React.ReactNode;
  /** Horizontal placement of the default bar. */
  align?: "left" | "center" | "right";
  /** Desaturate the imagery so the red intervention is the only colour. */
  bw?: boolean;
  className?: string;
}) {
  return (
    <div className={`intervention ${className}`.trim()}>
      <div className={`intervention__media ${bw ? "is-bw" : ""}`.trim()}>{children}</div>
      {overlay ? (
        <div className={`intervention__overlay intervention__overlay--${align}`}>{overlay}</div>
      ) : (
        <svg
          className={`intervention__bar intervention__bar--${align}`}
          viewBox="0 0 120 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={BRUSH_BAR} fill="var(--at-red)" />
        </svg>
      )}
    </div>
  );
}
