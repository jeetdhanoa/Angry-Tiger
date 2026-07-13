/**
 * Angry Tiger — motion tokens.
 *
 * Motion language: a film title sequence, not a SaaS landing page. Entrances
 * are long, decelerating, deliberate — content settles into place the way a
 * title card resolves. Interactions stay fast and decisive (a hard cut). The
 * brand's signature is the letterbox/film-frame reveal (a horizontal slit
 * opening to full frame); still photography and the hero both speak it.
 *
 * Single source of truth: both CSS (as custom properties in globals.css) and
 * the JS motion engine (src/lib/motion.ts) read these, so they can't drift.
 */

/** Interaction ease — decisive, near-symmetric. Hovers, small state changes. */
export const easeCut = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Entrance ease — a strong exponential deceleration. Things arrive fast and
 *  then settle slowly, which reads as weight and intention (title-card, not
 *  bouncy). Used for every reveal and the film-frame openings. */
export const easeCinematic = "cubic-bezier(0.16, 1, 0.3, 1)";

export const duration = {
  fast: 120,
  base: 200,
  slow: 400,
} as const;

export const disabledOpacity = 0.4;

/** Reveal-on-scroll: the cinematic entrance. Long, decelerating rise + fade.
 *  `staggerMs` is the gap between siblings in a sequenced group. `safetyMs`
 *  is the fail-safe — anything still unrevealed by then is shown regardless,
 *  so content is never stranded invisible if geometry/observer misbehaves. */
export const reveal = {
  distancePx: 26,
  transitionMs: 820,
  staggerMs: 110,
  ease: easeCinematic,
  safetyMs: 2000,
} as const;

/** Film-frame reveal for still photography — a letterbox slit opening to full
 *  frame. Slower and grander than a text reveal; this is the brand signature. */
export const frame = {
  transitionMs: 1050,
  ease: easeCinematic,
} as const;

/** Page-to-page transition — a restrained rise-through as the incoming route
 *  resolves. A cut, with just enough settle to feel authored. */
export const routeTransition = {
  distancePx: 18,
  transitionMs: 620,
  ease: easeCinematic,
} as const;

/** Letter-hover cascade (nav links, headline hovers). An interaction, so it
 *  stays on the decisive cut ease — no spring. */
export const letterHover = {
  cascadeMs: 24,
  ease: easeCut,
  transitionMs: 220,
} as const;

export const motion = {
  easeCut,
  easeCinematic,
  duration,
  disabledOpacity,
  reveal,
  frame,
  routeTransition,
  letterHover,
} as const;
