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

**Phase 3 shipped (2026-07-13) — speed.** Verified with a real production
build (`npm run build`), not just dev mode, since dev doesn't reflect real
bundle-splitting or font optimization.
- **Fonts**: Bebas/Inter/Homemade Apple converted TTF → woff2 (via
  fontTools, since `next/font/local` doesn't itself transcode format) —
  Bebas 57.7KB→20.7KB, Homemade Apple 109KB→49.9KB, Inter 874.7KB→349.3KB.
  Wired through `next/font/local` (`src/app/fonts.ts`) instead of manual
  `@font-face`, so Next auto-preloads all three (confirmed via
  `<link rel="preload" as="font">` in `<head>`). The unused 904KB italic
  Inter face was deleted outright — nothing in the codebase ever sets
  `font-style: italic`.
- **Images**: the four photo stills (home/production×2/about) now go
  through `next/image` with `fill` + `sizes`. Home's is `priority` (above
  the fold — confirmed a `<link rel="preload" as="image">` with the full
  responsive `imagesrcset` gets injected); Production/About default to
  `loading="lazy"` (below the fold). Verified the responsive `srcset`
  (384w→3840w) generates correctly; couldn't verify the lazy-load
  IntersectionObserver actually firing on scroll in this environment (same
  zero-viewport tooling limitation noted elsewhere in this doc) but the
  wiring (`loading="lazy"`, correct aspect-ratio reserved via the
  container, no layout shift) checks out.
- **Middleware**: matcher narrowed from "every non-static route" to just
  `/account/:path*` and `/admin/:path*` — `updateSession()`'s only job is
  refreshing the Supabase cookie, and the only pages that read it
  (client-side, via `useAuth()`) are those two. Every marketing-page
  request was paying an Edge Function invocation + a Supabase network
  round-trip for a refresh nobody consumed. Added a cookie check
  (`sb-*` prefix) inside `updateSession()` too, as defense-in-depth in case
  the matcher gets widened again later without this in mind.
- **AuthProvider**: `@/lib/supabase/client` (pulls in `@supabase/ssr` +
  `@supabase/supabase-js`) is now dynamically `import()`ed inside a
  `useEffect` instead of statically imported — code-splits it out of the
  bundle every marketing page paid for, since `AuthProvider` wraps the
  whole site (Nav needs it) but most visits never touch auth. Confirmed
  with a real build: marketing pages are 108–117 kB First Load JS vs.
  169–172 kB for `/account/*` and `/admin/*` — a ~55–60 kB difference,
  exactly matching the Supabase chunk now loading only where it's used.

**Phase 4 shipped (2026-07-13) — motion, the correctness/brand-aligned
half.** The audit's motion section splits into "fix what's wrong/off-brand"
(shipped) and "add cinematic flourish" (held for sign-off — see below), the
split drawn at the brand's own documented spec: *hard cuts and quick fades,
120–200ms, no springs*. Verified in the browser (computed easing/will-change,
lightbox animation on open, splash render states).
- **Tokens are no longer decorative**: `lib/motion.ts` now imports easing +
  reveal + letter-hover timings from `src/design/motion.ts` instead of
  hardcoding a stray Material-Design curve. One source of truth for CSS and
  the JS engine.
- **Letter-hover spring killed**: was `cubic-bezier(0.34,1.4,0.5,1)` (an
  overshoot — a spring, which the brand's own rule forbids); now the brand's
  hard-cut ease. Verified: the 45 nav letter spans compute
  `cubic-bezier(0.65,0,0.35,1)`, no overshoot.
- **will-change hygiene**: letter spans no longer each hold a permanent
  compositor layer (~191 promoted elements on Home). `will-change:transform`
  is now set on hover and cleared after the retract settles. Verified the
  full at-rest → hover → leave → cleared lifecycle.
- **Splash returning-visitor flash fixed**: starts in `done` so the SSR HTML
  and first client render carry no splash at all — a returning visitor never
  gets a frame of it (was rendered-by-default and flashed away in an effect).
  Only a genuine first-of-session visitor flips it on post-mount, over the
  already-black page. Honors `prefers-reduced-motion` (skips). Verified: no
  `.splash` node for returning visitors.
- **Lightbox open animation**: quick backdrop fade (200ms) + image settle-in
  (320ms, slight scale), reduced-motion guarded. Was a hard pop.
- **Production/About still hover**: slow filmic scale push-in (1.03 over
  1200ms on the brand ease), `overflow:hidden` clip, reduced-motion guarded.

**Phase 5 shipped (2026-07-13) — cinematic motion language (owner reversed
the Phase-4 hold).** The owner explicitly retired the "120–200ms hard-cut"
spec for a film-title-sequence direction (see memory `feedback-cinematic-motion`).
Built and verified in the browser (had to force a real viewport + real scroll
gestures to beat the headless zero-viewport/rAF throttling; frame reveals and
transitions confirmed via CSSOM + forced-final-state since CSS transitions
don't paint-advance headless).
- **Reveal engine rewritten to be fail-safe.** The old IntersectionObserver
  reveal *left whole pages blank* when the observer didn't fire (100%
  reproducible: About rendered all-black — the reviewer's "content stuck
  invisible"). Replaced with a geometry-based trigger + a **rolling safety
  net**: any content still hidden after 2s is shown regardless, rescheduled on
  every content change so **client navigations are covered too** (a second bug:
  late-mounted content had no net and depended entirely on rAF). Content can
  no longer be stranded invisible on any path. Verified: load reveal, scroll
  reveal (real gesture), client-nav reveal, and the net all fire.
- **Cinematic entrances**: `--ease-cinematic` (expo-out `cubic-bezier(0.16,1,0.3,1)`),
  ~820ms rise+fade — replaces the timid 180ms/14px fade.
- **Sequential choreography** via `[data-seq]`: a container cascades its
  children ~110ms apart (decorative/aria-hidden children skipped). Applied to
  every hero, the About principles (per-row), the Production department list
  (credits-roll), the Films/TV/Vertical redacted slates (per-row), the home
  rows. Composition rule: a bare section that contains an explicit reveal
  target defers to it (no double entrance).
- **Film-frame reveals** (`[data-reveal-frame]` via `Zoomable revealFrame`):
  stills open from a letterbox slit to full frame (`clip-path inset(46%)→0`,
  1050ms) — the hero's signature, generalized. Home/Production/About stills.
- **Route transition**: incoming page rises-through (620ms) on client nav
  only (not first paint / splash's moment). `RouteTransition` keyed on
  pathname; transform resolves to none (no lingering containing block).
- Hero-logo film-frame open re-timed onto `--ease-cinematic`.
- All reduced-motion guarded (engine early-returns → nothing hidden; CSS
  media queries disable the keyframes/transitions).

**Phase 6 shipped (2026-07-13) — new surface area + engineering cleanups.**
Owner-scoped to §4 (brand arsenal), §5 (JobPosting — see decision), §6 (eng
cleanups). Note: the §6 *performance* list (Inter→woff2, next/image,
middleware short-circuit, Auth/Cart provider scoping) was already done in
Phases 1 & 3. What landed here:
- **ESLint** (`eslint-config-next`, pinned to 15.x; ESLint 8 because 9's flat
  config hits a circular-ref bug with the Next config) + `typecheck` + `test`
  scripts. Fixed the 6 real lint errors it surfaced; lint is clean.
- **Branded error boundaries**: `app/error.tsx` (route-level, "That take
  didn't roll" + retry) and `app/global-error.tsx` (self-contained root-layout
  catch, "The reel jammed"). Skipped `loading.tsx` (static site, no suspends).
- **Admin defense-in-depth**: middleware redirects `/admin/*` to home when
  there's no session cookie (RLS + is_admin() are still the real gate).
- **Consolidations**: `rupees`→`lib/format` (admin bundles stop pulling the
  cart); `EMAIL_RE`/`validEmail`→`lib/validation` (client+server share one
  rule); `db`/`captchaOk`→`lib/server/form-defense` (were copy-pasted across
  both API routes); `AccountShell`+`AdminShell`→one `GateShell` (were ~90%
  identical).
- **Deleted the dead design token files** (colors/spacing/radius/shadows/
  typography/index — imported by nothing, mirrors of CSS that could drift).
  Kept motion/graphics/icons (actually consumed).
- **Vitest + 13 unit tests**: rate-limit sliding window (fake timers),
  validEmail, rupees grouping, legacySlug (extracted the pure piece of the
  DB-coupled cart merge to test it).
- **Organization JSON-LD** in the root layout (knowledge-panel eligibility).
- Removed the two forbidden **drop-shadow** filters on the Intervention device.
- **Brand arsenal**: one §5.04 illustration (faint umbrella) deployed into the
  About-principles empty column, matching the accepted ghost-mark device.

**Held / deferred from Phase 6 (with reasons):**
- **JobPosting structured data — NOT added.** The /production rows are
  deliberately open calls, not real listings; Google's JobPosting policy needs
  real dated postings, and marking generic ones risks a site-wide manual
  action. Add when there are real openings.
- **Rest of the brand arsenal** (Intervention over a dedicated B&W photo, the
  extended monogram, more illustrations on Films/TV) — held for the owner to
  look at the one shipped instance on the live deploy first. The aesthetic
  can't be verified here (headless screenshots come back black on scrolled
  sections), and this is subjective territory (contrast + grain were both
  reverted). One reversible instance beats a blind batch.
- **`useProtectedSubmit` hook** — the 5 forms differ enough (Nav auth is
  nothing like the honeypot submissions forms) that it's a weak dedup, and
  re-plumbing verified-working live forms risks regressions unverifiable here.
- **Env-flag the `.full.tsx` parking** — only benefits parked (non-launching)
  pages; per-page metadata handling makes it fiddlier than the rename dance is
  worth now.

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

## High Impact (worth doing before launch)

- **Contrast pass on red surfaces (reverted 2026-07-13, owner's call)** — black-on-red is 3.55:1, below AA (4.5:1) for anything under display size: primary buttons, chips, home red-panel body, About manifesto body, form/account errors, home-row hover, admin badges. A paper-text version was built and shipped, then reverted because the owner prefers the black-on-red look. Revisit only if asked — the code for the paper version is in git history (commit `eab60ab`) if wanted again.
- **Real forms on admin + parked pages**: Phase 2 converted every live public form (footer/contact/production/Nav auth/account); admin/products, admin/careers-review-type screens and the parked shop/membership/notes forms still use the old `onClick`-on-`type="button"` pattern
- **Focus-visible on `:focus` fallback for older browsers** — verify graceful degradation where `:focus-visible` isn't supported (should just get no ring, not a broken one, but worth a manual check)
- **Organization JSON-LD** in root layout (canonicals shipped in Phase 1)
- **Rewrite the five About principles** — the one AI-sounding block on the site
- Home body: kill "audiences of every demographic"
- **Motion — cinematic additions: SHIPPED in Phase 5** (owner retired the 120–200ms hard-cut spec for a film-title direction). Entrance decel, per-section sequencing, film-frame still reveals, and the page-to-page transition all landed and are verified. Two related items from the original list resolved differently:
  - **Reduce letter-hover deployment** from ~40 sites to nav + home rows — still open, subjective ("a signature everywhere is a tic"). Not touched in Phase 5.
  - **Pre-paint FOUC fix** for the first-paint reveal flicker — the Phase-5 engine mitigates the worst case (fail-safe net, direct settle) but the true fix (hide-before-paint via an inline `data-js` stamp so there's zero flash on first load) is still open. Do it with a real device confirming no stranding.
  - **Hero headline mask-rise** (text rising out of a clipped baseline band — the quintessential title-sequence move) was *deliberately deferred*: it needs per-hero markup surgery and descender-clipping checks that can't be verified here (CSS transitions don't paint-advance in this headless browser). The heroes already rise+fade via `[data-seq]`; the mask-rise is the one remaining escalation, best done on a real device.
- **Splash: skippable on any input** (click/key dismisses early) — small, do anytime.
- Branded `global-error.tsx` (the 404 proves the voice exists)
- Debounce the whole-body MutationObservers (they re-query the DOM on every keystroke in the search field)
- Admin defense-in-depth: middleware redirect for `/admin/*` without a session
- Rate-limit before parsing the 4MB multipart body in `/api/careers`

## Future Enhancements (after launch)

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
