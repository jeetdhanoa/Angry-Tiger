/**
 * Angry Tiger — color tokens.
 * Source of truth: official Brand Guidelines (Shanaya.Studio, July 2026),
 * §3 Brand Colours. The palette is deliberately just three colors —
 * Signal Red, Jet Black, White — used with discipline (see the PDF's
 * "Keep the palette disciplined" principle). Everything below that isn't
 * one of those three is a documented *utility* extension needed to build
 * a real interactive product (hover/press feedback, muted UI text) — the
 * guideline doesn't cover interaction states, so these fill that gap
 * without introducing new brand hues.
 */

export const brand = {
  /** Signal Red — HEX #C90E0E · RGB 201,14,14 · CMYK 14,100,100,5. "The colour of impact." */
  signalRed: "#c90e0e",
  /** Jet Black — HEX #000000 · RGB 0,0,0. "The visual foundation of the identity." */
  jetBlack: "#000000",
  /** White — HEX #F4F1E7 · RGB 244,241,231. "A supporting neutral... introduced only when needed." */
  white: "#f4f1e7",
} as const;

/**
 * Interaction states. The brand has ONE red — Signal Red — and the
 * guideline is explicit: "Do not use any other shade of red." So hover and
 * pressed are Signal Red too; the *feedback* is a brightness shift applied
 * at the CSS layer (--hover-lift: brightness(1.12) / --press-shade:
 * brightness(0.85)) and white↔red colour swaps, never a different hue.
 */
export const interactive = {
  redHover: brand.signalRed,
  redPressed: brand.signalRed,
  hoverLift: "brightness(1.12)",
  pressShade: "brightness(0.85)",
} as const;

/**
 * Utility neutrals for real UI needs (muted captions, disabled states,
 * elevated surfaces) that the 3-color brand palette doesn't cover. Kept
 * deliberately close to Jet Black/White so they read as shades of the
 * brand neutrals, not new brand colors.
 */
export const neutral = {
  charcoal: "#1c1b1a", // elevated dark surface (cards on black)
  grey: "#8a8785", // muted captions on white/paper
  greyDark: "#4a4846", // secondary text on paper
} as const;

export const colors = {
  ...brand,
  ...interactive,
  ...neutral,
} as const;

export type ColorToken = keyof typeof colors;

/** Semantic aliases — what a component asks for, not which hex it is. */
export const semanticColors = {
  surfacePage: brand.jetBlack,
  surfacePaper: brand.white,
  surfaceCard: neutral.charcoal,
  surfaceOverlay: "rgba(0, 0, 0, 0.82)",

  textOnDark: brand.white,
  textOnDarkMuted: "rgba(244, 241, 231, 0.86)",
  textMuted: neutral.grey,
  textOnRed: brand.jetBlack,
  textOnPaper: brand.jetBlack,
  textAccent: brand.signalRed,

  interactivePrimary: brand.signalRed,
  interactivePrimaryHover: interactive.redHover,
  interactivePrimaryActive: interactive.redPressed,

  hairlineOnDark: "rgba(244, 241, 231, 0.14)",
  hairlineOnDarkStrong: "rgba(244, 241, 231, 0.18)",
  hairlineOnPaper: "rgba(0, 0, 0, 0.25)",
} as const;
