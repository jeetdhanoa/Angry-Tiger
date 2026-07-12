# Angry Tiger — Improvement Backlog

Maintained by the creative/technical audit (July 2026). Classification:
**Quick Wins** (under 30 min) · **High Impact** (do before launch) ·
**Future Enhancements** (after launch) · **Experimental / Signature** (ideas that make Angry Tiger memorable).

**Phase 1 shipped (2026-07-13).** Bug fixes and SEO items landed and were
verified in the browser (canonicals resolve per-route, /projects 308s,
robots/sitemap/OG confirmed, search suggestions return results). Two items
live on as launch-day runbook steps — see **README → Launch checklist**: the
setup.sql §7/§11 anon-INSERT revokes and the `SUPABASE_SERVICE_ROLE_KEY` env
var (both routes now log a production warning while running on the anon
key).

**The contrast pass (black-on-red → paper-on-red) was reverted at the
owner's request (2026-07-13) — restored to black text on red everywhere**
(buttons, chips, home red-panel body, About manifesto body, form/account
errors, home-row hover, admin badges). Still queued below under High Impact
if the owner wants to revisit it later.

**Phase 2 shipped (2026-07-13) — keyboard access & forms.** Verified live in
the browser (button focusability, dialog focus traps/restore, form
submission via real submit events, ARIA roles reflected in the DOM).
- Zoomable is now a real `<button>` (was `div onClick`). First attempt used
  `display: contents` to keep it invisible to the surrounding grid/flex
  layout, but that turned out to make the button unfocusable in testing —
  a genuine cross-browser gotcha, not just a lint nit. Fixed by making it a
  plain `display: block; width: 100%; align-self: start` box instead, which
  becomes the actual grid/flex item (same as the div did) without losing
  focusability.
- New shared `useFocusTrap` hook (`src/lib/useFocusTrap.ts`): moves focus
  into an overlay on open (optionally to a specific element, e.g. the
  search input rather than its own close button), cycles Tab/Shift+Tab at
  the container's edges, restores focus to the trigger on close. Wired into
  the lightbox and all three Nav overlays (search/account drawer/mobile
  menu), each now `role="dialog" aria-modal="true"`.
- Every live form (footer newsletter, contact, production careers, Nav
  auth, account settings ×2, account addresses) is a real
  `<form onSubmit>` — Enter now submits, errors carry `role="alert"`,
  success states carry `role="status"`. Admin forms and the parked
  membership/shop pages weren't touched — lower priority since they're
  either internal-only or unrouted.
- Global `:focus-visible` ring — red by default (matches the existing
  file-pick precedent), overridden to black on red-background controls
  (primary buttons, active chips, sign-in, checkout, skip link) so the ring
  doesn't vanish against the fill. Per the owner's standing black-on-red
  preference, this stayed red/black — not paper — unlike the audit's
  original "paper white ring" suggestion.
- Skip-to-content link + `id="main-content"` on every page's `<main>`
  (was `<div className="page">` sitewide, 14 files) + a visually-hidden
  `<h1>` on Home (its visible "heading" is the wordmark graphic).

---

## Quick Wins (under 30 minutes each)
- Title template is pass-through `"%s"` and three parked pages lose the brand suffix — set `template: "%s — Angry Tiger"` and strip suffixes from page titles
- "screen printed front and center" → "screen-printed front and centre" (UK spelling) (`src/app/shop/page.full.tsx:60`)
- "About the House" (footer) vs "About the house" (home) — standardise lowercase; "Sign out" (Nav) vs "Log out" (account) — pick one
- Footer "All Rights Reserved" → sentence case
- De-Title-Case mid-sentence caps on Home/About/Contact ("Production House for Feature Films…")
- De-dupe "every application gets read" (production, twice) and "we read everything and reply fast" (contact, twice)
- Drop Oxford commas sitewide (UK house style); one canonical format list: "feature films, television and vertical series"
- About closing line → canonical "Every memorable story begins with a fearless idea."
- Missing full stop: "Add it in account settings" (`src/app/account/page.tsx:29`)
- Remove dead `filter` from `.btn` / `.cart__checkout` / `.account__signin` transition lists
- Remove the two latent `drop-shadow` filters on Intervention styles (brand forbids shadows) (`globals.css:3307,3335`)
- Delete unused `--filter-red-duotone` and `--shadow-card` tokens
- Update stale JSDoc on CaptionLabel ("Inter, uppercase" → Bebas)
- Escape listener scope: only `closeAll()` when an overlay is actually open (`src/components/Nav.tsx:75`)
- Footer tiger mark `alt=""` (decorative); About closing wordmark `alt=""`
- Middleware matcher: exclude `/sitemap.xml`, `/robots.txt`

## High Impact (worth doing before launch)

- **Contrast pass on red surfaces (reverted 2026-07-13, owner's call)** — black-on-red is 3.55:1, below AA (4.5:1) for anything under display size: primary buttons, chips, home red-panel body, About manifesto body, form/account errors, home-row hover, admin badges. A paper-text version was built and shipped, then reverted because the owner prefers the black-on-red look. Revisit only if asked — the code for the paper version is in git history (commit `eab60ab`) if wanted again.
- **Real forms on admin + parked pages**: Phase 2 converted every live public form (footer/contact/production/Nav auth/account); admin/products, admin/careers-review-type screens and the parked shop/membership/notes forms still use the old `onClick`-on-`type="button"` pattern
- **Focus-visible on `:focus` fallback for older browsers** — verify graceful degradation where `:focus-visible` isn't supported (should just get no ring, not a broken one, but worth a manual check)
- **Fonts**: 1.74MB TTF Inter → `next/font/local` woff2; drop the unused 884KB italic; preload Bebas
- **Images**: `next/image` (or resized ~1600px JPEGs) + `loading="lazy"` below fold — 2.9MB of stills today
- **Middleware short-circuit**: skip the Supabase round-trip when no `sb-*` cookie exists; narrow matcher to `/account`, `/admin`
- **Organization JSON-LD** in root layout (canonicals shipped in Phase 1)
- **Rewrite the five About principles** — the one AI-sounding block on the site
- Home body: kill "audiences of every demographic"
- **Motion foundation**: wire `design/motion.ts` tokens into `lib/motion.ts`; kill the letter-hover spring (brand says no springs); add entrance easing (`cubic-bezier(0.22,1,0.36,1)`, ~800ms); child stagger via `data-reveal-seq`; fix the post-hydration flicker (hide-before-paint via `data-js` stamp)
- **Film-frame clip-path wipes** on production stills (letterbox/slate wipe instead of fade)
- Lightbox open/close animation + slow filmic push-in hover on stills
- Splash: skippable on input, reduced-motion skip, fix returning-visitor flash (read sessionStorage in state initializer)
- Branded `global-error.tsx` (the 404 proves the voice exists)
- Remove permanent `will-change` from letter spans (191 promoted layers measured on home); debounce the whole-body MutationObservers
- Admin defense-in-depth: middleware redirect for `/admin/*` without a session
- Rate-limit before parsing the 4MB multipart body in `/api/careers`

## Future Enhancements (after launch)

- View Transitions API page cuts (200ms crossfade; degrades gracefully)
- Consolidations: `GateShell` (AccountShell+AdminShell), `useProtectedSubmit()`, `lib/server/form-defense.ts`, `formatDate()`, `rupees()` → `lib/format.ts`
- Replace the `.full.tsx` parking pattern with env-flag switches
- Wire or delete the unreferenced `src/design/*.ts` token files
- ESLint + typecheck script + unit tests (rate-limit window, cart merge, API routes)
- Cart: atomic qty RPC (race on rapid clicks); `setDefaultAddress` as one RPC; build the cart drawer before un-parking the shop
- Zod validation at the Supabase trust boundary
- Account/admin pages: distinguish error from empty state; add loading skeletons (or move to server components)
- JobPosting structured data on production open calls
- Marker-scrub → CSS scroll-driven animations (JS fallback)
- apple-touch-icon; widen CSP img-src only if image optimization moves domains
- Deploy the unused brand arsenal: Intervention component, matchstick/umbrella/chair illustrations (About principles' empty right column), extended monogram, `circle`/`slash` marker variants
- Archive the stale design-handoff token folder so nobody copies `#d9010f` back in
- Verify nav monogram clear-space (width of "g") — may need 48px logo or taller nav

## Experimental / Signature (what could make Angry Tiger unforgettable)

*From the Phase 2 reinvention — see the creative direction document for full treatments.*

- **The Certificate** — a CBFC-style censor-certificate card as the first-visit entrance (stamped, dated, "certified fearless"); hard cut for returning visitors
- **Now Showing** — the homepage as a marquee that programs one work at a time instead of listing everything
- **The Ledger** — the filmography as a numbered production ledger that grows from 1 to 50 films without redesign
- **The Interval** — a full-bleed INTERVAL title card at the midpoint of the longest pages (deeply Indian, wry, a breath)
- **"CUT." / "ACTION."** — typing CUT anywhere freezes all motion (a functional reduced-motion toggle as an easter egg); ACTION slates the page with a marker scribble
- **Subtitle storytelling + bilingual moments** — key lines delivered as timed lower-third subtitles; Devanagari companion type; the handwritten tagline in Hindi
- **Hand-painted poster tradition** — commission Bombay poster artists for every release; poster-first film pages that tear/wipe into the dossier
- **The Matchbox** — every merch drop ships with the brand matchbox; the shop's signature physical object
- **Red is the present tense** — a systemic rule: Signal Red only ever marks what is alive *now* (shooting, premiering, dropping)
- **Frame 24** — a film-strip footer whose 24th frame is a hidden door to the vault (BTS reels, first frames)
- **The tiger blinks** — idle 30s on the hero and the tiger moves once; never twice a session
- **Console call sheet** — a crew call sheet printed in devtools console with a hiring link
- **Slate-clap page transitions** — sound off by default; silence belongs to the house, sound belongs to the work
- **Vertical-first mobile** — the mobile site treats 9:16 as its native cinema, because Vertical is a format the house actually makes
- **Film-grain overlay** — tiled ~3% opacity grain unifying the digital surface with the print identity

## R&D Lab concepts (Phase 3 — see the R&D document for full treatments)

*Buildable today unless marked. The archive-first discipline (capture everything during production) is the prerequisite moat for most of these.*

- **The Answer Print** — every session renders through a seeded WebGL grain/weave/flicker pipeline as a numbered, unique "print" of the site
- **The Premiere Engine** — redacted ledger entries tear open live (WebSocket broadcast + paper-tear shader) at announcement timestamps; being there matters
- **The Screening Room** — a WebGL single-screen Indian cinema with real-time anonymous audience presence
- **Houselights** — UI dims to true black and letterboxes before any video plays; lights up after
- **The Screenplay Room** — scripts as directed reading experiences (typing pace, INT/EXT light changes, page↔final-frame comparisons post-release)
- **Shot-grammar navigation** — View Transitions choreographed as cut-in / reverse-shot / match-cut by IA direction
- **The Steenbeck** — archive footage on a crank-driven virtual flatbed editor (pointer rotation + Web Audio playbackRate)
- **The Grade Suite** — real-time LUT scrubbing between log and final grade; visitors export a certificate-stamped frame
- **The Recce Map** — shooting locations on custom black/paper/red cartography; recce photo vs final frame sliders
- **The Crew Constellation** — every collaborator across every production as an explorable force graph
- **Production telegrams** — Web Push dispatches from set in telegram voice ("DAY 22 STOP RAIN STOPPED PLAY STOP")
- **The Field Cut** — Service Worker offline screening + network-aware "animatic mode" on slow connections
- **The Archivist** — RAG-grounded AI that only retrieves the human archive (doctrine: AI retrieves, never generates)
- **24 Frames** — 24 one-of-one claimable frames per release (signed artifacts + print fulfillment, no blockchain)
- **The Register** — props/costumes as a photogrammetry evidence archive (model-viewer/R3F)
- **Set visits in WebXR** — photogrammetry-preserved sets captured during production, walkable later
- **The Negative** — dark mode as a designed photographic negative of the entire brand
- **Houdini marker primitive** — `paint(at-marker)` worklet making seeded hand-drawn imperfection a CSS-level brand asset
- **Say-the-line unlock** — SpeechRecognition passphrase marketing (opt-in, on-device)
- **The tiger watches** (near future) — opt-in on-device gaze tracking; the hero tiger tracks your eyes
- **The One-Take Site** (near future) — entire site as one continuous WebGPU camera move; routes are marks
- **Second-screen premieres** (near future) — timecode-synced companion mode during screenings
- **The Production OS → public window** (long-term) — internal production tooling with designed public-facing panes
