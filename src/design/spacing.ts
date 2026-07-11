/**
 * Angry Tiger — spacing tokens.
 * The Brand Guidelines describe layout *principles* (§5.01 Structured
 * Composition: "disciplined editorial grid... strong vertical divisions...
 * generous negative space") rather than literal pixel values, so this
 * scale is this codebase's own implementation of that principle — a
 * standard 4px base scale, plus the fluid section paddings already in use
 * across every page.
 */

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
  7: "48px",
  8: "64px",
  9: "96px",
  10: "128px",
} as const;

/** Fluid horizontal page padding used on every section, edge to edge. */
export const pageInset = "clamp(20px, 4vw, 40px)";

export const spacing = { space, pageInset } as const;
