/**
 * Angry Tiger — motion tokens.
 * The Brand Guidelines describe the brand's temperament — "creative
 * fearlessness," "instinctive," "structured compositions create tension"
 * — which this codebase translates into a hard-cut motion language: quick
 * fades and snaps, never springs or bounces. Exact durations/easing
 * aren't specified in the PDF; these are `lib/motion.ts`'s existing,
 * already-shipped values, now centralized here as the single source both
 * CSS and the JS motion engine read from.
 */

export const easeCut = "cubic-bezier(0.65, 0, 0.35, 1)";

export const duration = {
  fast: 120,
  base: 200,
  slow: 400,
} as const;

export const disabledOpacity = 0.4;

/** Reveal-on-scroll: fade-up distance and stagger between batched elements. */
export const reveal = {
  distancePx: 14,
  transitionMs: 180,
  staggerMs: 70,
} as const;

/** Letter-hover cascade (nav links, headline hovers). Eases on the brand's
 *  hard-cut curve — the old value overshot (a spring), which the brand's own
 *  motion rule forbids ("no bounces, no springs"). */
export const letterHover = {
  cascadeMs: 24,
  ease: easeCut,
  transitionMs: 220,
} as const;

export const motion = {
  easeCut,
  duration,
  disabledOpacity,
  reveal,
  letterHover,
} as const;
