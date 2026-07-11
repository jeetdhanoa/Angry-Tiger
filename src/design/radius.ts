/**
 * Angry Tiger — radius tokens.
 * The Brand Guidelines don't mention corner radius (logos and layouts in
 * the PDF are all hard-edged rectangles). This codebase's own convention,
 * carried from the original design handoff, is square corners everywhere
 * — with exactly one intentional exception, the Ambush membership card,
 * which reads as a physical credit card and needs a believable radius.
 */

export const radius = {
  none: "0px",
  /** The Ambush membership card only. */
  card: "16px",
} as const;
