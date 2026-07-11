/**
 * Angry Tiger — typography tokens.
 * Source of truth: Brand Guidelines §4 Brand Typography.
 *
 * Three typefaces, each with one job:
 *  - Bebas Neue   (Primary)   — headlines, posters, hero sections, statement graphics
 *  - Inter        (Secondary) — body copy, articles, long-form content
 *  - Inter UPPER  (Accent)    — eyebrows, captions, metadata, nav, buttons/CTAs, tags
 *  - Homemade Apple (Decorative) — signature sign-offs; one small aside per page, never more
 *
 * Letter-spacing: the guideline specifies **-3%** for Bebas Neue, Inter body,
 * and the Inter uppercase accent style alike — tighter than typical caps
 * tracking convention, but that's the documented spec, not a typo.
 * -3% (design-tool tracking) → -0.03em (CSS letter-spacing).
 */

export const fontFamilies = {
  display: '"Bebas Neue", "Arial Narrow", sans-serif',
  body: '"Inter", "Helvetica Neue", sans-serif',
  script: '"Homemade Apple", cursive',
} as const;

/** -3% per guideline, applies to Bebas Neue, Inter body, and Inter uppercase accent alike. */
export const tracking = {
  brand: "-0.03em",
  /** Wide, spread credit-line treatment (film-credits convention) — a deliberate
   *  house-style choice outside the guideline's three documented type roles;
   *  left as-is rather than guessed at. */
  wideCredit: "0.3em",
} as const;

/** Inter weights as named in the guideline, mapped to numeric values. */
export const fontWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
} as const;

/** Display (Bebas Neue) scale — sizes are this system's own implementation
 *  detail; the guideline specifies use-cases, not literal px values. */
export const displayScale = {
  poster: "clamp(72px, 12vw, 180px)",
  hero: "96px",
  h1: "64px",
  h2: "44px",
  h3: "30px",
  h4: "22px",
} as const;

/** Body (Inter) scale. */
export const bodyScale = {
  lede: "20px",
  base: "16px",
  small: "14px",
  caption: "12px",
  micro: "10px",
} as const;

export const leading = {
  display: 0.92,
  tight: 1.1,
  body: 1.55,
} as const;

export const typography = {
  fontFamilies,
  tracking,
  fontWeights,
  displayScale,
  bodyScale,
  leading,
} as const;
