# Angry Tiger — Website

Marketing + commerce site for **Angry Tiger**, an independent Bollywood production
house (brand identity by Shanaya.Studio, 2026). Implemented from the Claude Design
handoff in `design-handoff/` (pixel-faithful to the prototypes there).

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Plain CSS with the brand's design tokens in [app/globals.css](app/globals.css)
  (Bebas Neue / Inter / Homemade Apple, `--at-red #C90E0E`, square corners,
  hard-cut motion)
- No backend yet — fully static, deployable anywhere (`npm run build`)

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Pages

`/` Home · `/projects` · `/about` (paper page) · `/shop` · `/notes` ·
`/membership` (The Ambush) · `/contact`

Shared: Nav (search overlay, cart drawer, account drawer, mobile menu at <920px),
Footer (newsletter + Contact/Explore/Follow columns), Splash (once per session)
plus full-page film grain.

## Motion ([lib/motion.ts](lib/motion.ts))

Brand spec: hard cuts and quick fades, 120–200ms, no springs.

- Section reveals: fade up 14px on viewport entry, batches cascade 70ms apart
- Headline parallax (`data-parallax`)
- Film-grain flicker (stepped, ~8fps)
- Letter-hover (`data-letter-hover`): letters lift/scale in a 24ms cascade
- Everything respects `prefers-reduced-motion`

## Prototype state → production TODO

These are front-end prototypes, carried over from the design intentionally:

- **Cart** persists to `localStorage["at-cart-v1"]` — replace with a real cart
  service / payments when commerce goes live
- **Account** persists to `localStorage["at-account-v1"]` — replace with real auth
- Newsletter, waitlist and contact forms only update local UI state — wire to a
  backend or form service
- `<ImageSlot>` components mark where real photography goes (Home production
  still, Shop product shot, About B&W still). Art direction: B&W / red-duotone,
  grainy, a wide range of people on and off screen. Parents already apply the
  duotone CSS filters.

## Assets

- Logos in `public/logos/` — official brand PNGs, never redraw the tiger
- Fonts in `public/fonts/` — Bebas Neue, Inter (variable), Homemade Apple
- Original design bundle in `design-handoff/` (reference only, not shipped)
