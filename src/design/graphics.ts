/**
 * Angry Tiger — Graphic System tokens.
 * Source of truth: official Brand Guidelines (Shanaya.Studio, July 2026),
 * §5 Graphic System. This section is "the brand's signature layer": the
 * recurring visual devices that extend the identity beyond logo/type/colour.
 *
 * The five sub-systems in the PDF, and where each lives in this codebase:
 *   5.01 Structured Composition   → layout utilities (.gfx-grid / .gfx-vrule)
 *   5.02 Intentional Disruption   → oversized marks + overlap (.gfx-disrupt)
 *   5.03 Expressive Marks         → <MarkerStroke/> (rough marker highlights)
 *   5.04 Illustrative Language    → <Illustration/> (the hand-drawn objects)
 *   5.05 Illustrative Intervention→ <Intervention/> (bold red over B&W photo)
 *
 * All illustrative art stays within the core palette — rendered in Signal Red
 * by default (guideline: "Stay within the core brand colour palette"). The
 * source SVGs are solid black-on-transparent silhouettes, so they're recoloured
 * at the CSS layer via `mask-image` rather than being edited — one asset, any
 * brand colour, no bundle cost.
 */

/**
 * 5.04 Illustrative Language — handcrafted objects with rough, hand-drawn
 * edges and bold silhouettes (guideline: "Prioritise bold silhouettes over
 * fine detail", "feel expressive rather than polished"). Files live in
 * /public/graphics; `ratio` = width / height from each SVG's viewBox, so the
 * component can reserve correct space without loading the file first.
 */
export const illustrations = {
  "chair-dining": { src: "/graphics/chair-dining.svg", ratio: 293.57 / 530.17, label: "Hand-drawn chair" },
  "chair-office": { src: "/graphics/chair-office.svg", ratio: 324.1 / 446.17, label: "Hand-drawn office chair" },
  matchstick: { src: "/graphics/matchstick.svg", ratio: 539.08 / 416.38, label: "Scattered matchsticks" },
  umbrella: { src: "/graphics/umbrella.svg", ratio: 410.99 / 302.74, label: "Hand-drawn umbrella" },
} as const;

export type IllustrationName = keyof typeof illustrations;

/**
 * 5.03 / 5.02 Expressive Marks — the brand's own rough gestural elements
 * (the sketchy AT, the tiger, the horizontal scribble seen on the matchbox).
 * Large graphic devices, used sparingly as focal points or oversized,
 * grid-breaking accents behind content.
 */
export const expressiveMarks = {
  at: { src: "/graphics/mark-at.svg", ratio: 853 / 1144.53, label: "" },
  tiger: { src: "/graphics/mark-tiger.svg", ratio: 701.07 / 1145, label: "" },
  horizontal: { src: "/graphics/mark-horizontal.svg", ratio: 1323 / 375.82, label: "" },
} as const;

export type ExpressiveMarkName = keyof typeof expressiveMarks;

/**
 * 5.03 Expressive Marks — rough marker strokes authored inline (not brand
 * assets) for *highlighting* type: underline, cross-out, circle, slash. Kept
 * deliberately imperfect (guideline: "Keep marks imperfect and expressive",
 * "Use them to highlight rather than decorate", "Avoid symmetrical or polished
 * illustrations"). Each is a hand-wobbled path on a 0..100 × 0..100 grid so it
 * can stretch to any element via preserveAspectRatio="none".
 */
export const markerStrokes = {
  /** A single continuous underline with a subtle hand-drawn waver. */
  underline:
    "M1,58 C25,55 50,61 74,57 C84,55 93,60 99,58",
  /** A double-pass cross-out through the word's centre, overshooting both ends. */
  strike:
    "M1,46 C20,41 44,52 66,43 C80,37 92,49 99,42 M4,54 C24,48 46,58 70,49 C82,44 93,54 98,50",
  /** A loose ellipse that doesn't quite close — a circled-for-emphasis mark. */
  circle:
    "M50,10 C22,9 6,26 8,50 C10,74 30,92 54,90 C80,88 95,68 92,44 C89,22 72,10 46,12",
  /** A single diagonal slash, thick and fast. */
  slash: "M8,86 C28,64 52,44 74,26 C82,19 90,14 95,10",
} as const;

export type MarkerStrokeName = keyof typeof markerStrokes;
