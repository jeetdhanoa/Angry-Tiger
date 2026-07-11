# Angry Tiger — Website

Marketing + commerce site for **Angry Tiger**, an independent Bollywood production
house (brand identity by Shanaya.Studio, 2026). Implemented from the Claude Design
handoff, then aligned to the official Brand Guidelines PDF — see
[Design system](#design-system-srcdesign) below.

## Stack

- [Next.js](https://nextjs.org) (App Router, `src/` layout) + React + TypeScript
- Plain CSS with the brand's design tokens in [src/app/globals.css](src/app/globals.css),
  mirrored as typed TS in [src/design/](src/design) (Bebas Neue / Inter / Homemade
  Apple, Signal Red `#C90E0E`, square corners, hard-cut motion)
- No backend yet for content — Supabase covers auth/commerce/admin (below);
  deployable anywhere (`npm run build`)

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Design system ([src/design/](src/design))

Source of truth: the official **Brand Guidelines** (Shanaya.Studio, July 2026 PDF)
— not the earlier design-handoff prototypes, which predate it and were
superseded where the two disagree (see below).

- **[colors.ts](src/design/colors.ts)** — the 3-color brand palette (Signal Red
  `#C90E0E`, Jet Black `#000000`, White `#F4F1E7`), plus documented UI-only
  extensions (hover/pressed red, utility greys) the guideline doesn't cover
- **[typography.ts](src/design/typography.ts)** — Bebas Neue (primary), Inter
  (secondary + uppercase accent), Homemade Apple (decorative); **-3% letter-spacing**
  on Bebas Neue and Inter alike, per the guideline (tighter than the site's
  original tracking — corrected sitewide)
- **[spacing.ts](src/design/spacing.ts)**, **[radius.ts](src/design/radius.ts)**,
  **[shadows.ts](src/design/shadows.ts)** — this codebase's own implementation of
  the guideline's layout *principles* (disciplined grid, square corners,
  generous negative space); the PDF doesn't specify literal values here
- **[motion.ts](src/design/motion.ts)** — the hard-cut motion language's existing
  durations/easings, centralized as the single source `src/lib/motion.ts` and CSS
  both read from
- **[icons.ts](src/design/icons.ts)** + **[components/Icon.tsx](src/components/Icon.tsx)**
  — every nav icon as a typed registry + renderer, replacing inline SVGs

**Reusable components** ([src/components/](src/components)): `Button`, `Icon`,
`Input`/`Textarea` (the `.input-dark` + `.field` pattern used across the auth
drawer, footer, contact form, and admin), `CaptionLabel` (the eyebrow label on
every section).

**Corrected from the original implementation** (guideline is the final call —
applied both to the tokens and live on the site): Jet Black `#0A0A0A → #000000`;
White `#F5F3EF/#FCFCFC → #F4F1E7` (unified to one official white); Bebas Neue
and Inter tracking (including uppercase labels) `+1%/+14% → -3%`. Homemade
Apple is explicitly exempted (`letter-spacing: normal`) since tightening a
connected cursive script breaks its letterforms, and the guideline's -3% spec
only covers Bebas Neue and Inter. Logos and fonts now ship from the official
Brand Design package (SVG logo suite alongside the original PNGs, official
font files) rather than the earlier design-handoff bundle.

## Pages

`/` Home · `/projects` · `/about` (paper page) · `/shop` · `/notes` ·
`/membership` (The Ambush) · `/contact`

Shared: Nav (search overlay, cart drawer, account drawer, mobile menu at <920px),
Footer (newsletter + Contact/Explore/Follow columns), Splash (once per session)
plus full-page film grain.

## Motion ([src/lib/motion.ts](src/lib/motion.ts))

Brand spec: hard cuts and quick fades, 120–200ms, no springs.

- Section reveals: fade up 14px on viewport entry, batches cascade 70ms apart
- Headline parallax (`data-parallax`)
- Film-grain flicker (stepped, ~8fps)
- Letter-hover (`data-letter-hover`): letters lift/scale in a 24ms cascade
- Everything respects `prefers-reduced-motion`

## Authentication (Supabase Auth)

Account sign-in / sign-up runs on **Supabase Auth** (email + password), wired
through `@supabase/ssr`:

- `src/lib/supabase/client.ts` — browser client + `supabaseConfigured` flag
- `src/lib/supabase/server.ts` — server client (Server Components / Route Handlers)
- `src/lib/supabase/middleware.ts` + `src/middleware.ts` — refresh the session per request
- `src/lib/auth.tsx` — `AuthProvider` / `useAuth()` (`signIn`, `signUp`, `signOut`, `user`)
- The account drawer in `src/components/Nav.tsx` consumes `useAuth()`

**Setup (required for auth to work):**

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API). Restart `npm run dev`.
3. Add those same two vars in Vercel → Project → Settings → Environment Variables.
4. (Optional) In Supabase → Authentication → Providers → Email, turn **off**
   "Confirm email" for instant sign-in during testing, or leave it on to require
   email confirmation (the UI handles both).

Until the env vars are set, the app runs in a graceful **"sign-in isn't connected
yet"** mode — every other part of the site works normally.

## Forms (newsletter · waitlist · contact)

All three forms deliver to Supabase tables (`newsletter_signups`,
`waitlist_signups`, `contact_submissions`) via `src/lib/submissions.ts`.
One-time setup: run [supabase/setup.sql](supabase/setup.sql) in the Supabase
SQL Editor — it creates the tables with insert-only RLS (visitors can write,
nothing is readable through the public API). Read submissions in
Supabase → Table Editor. Duplicate newsletter/waitlist emails read as success.

## Cart & catalog (Supabase)

- **Products** load from the public `products` table (`src/lib/products.ts`), with a
  built-in fallback so the shop renders even before Supabase answers.
- **Cart** (`src/lib/cart.tsx`): signed-in users get rows in the `cart` table — the
  cart follows them across devices. Guests keep a `localStorage["at-cart-v1"]`
  cart; on sign-in it merges into the account cart (quantities add) and local
  storage is cleared.

## Admin — "The office" (/admin)

Hidden back office (not linked from public nav; `noindex`). Sections:
overview counts, products (add / edit / delete / sold-out / hide), orders
(status: pending → paid → shipped / cancelled), users (admin toggle),
newsletter (copy-all + remove), contact messages, and the Ambush queue.

Access = `profiles.is_admin` checked by a security-definer `is_admin()`
function inside RLS policies, so admin rights live in the database, not the
client — and they're **domain-locked**: only `@angrytiger.in` logins can hold
keys (enforced in `is_admin()` against the live JWT plus a table constraint).
Grant access: sign up with a house email, then in the SQL Editor:
`update public.profiles set is_admin = true where email = 'you@angrytiger.in';`
Admins also get a "The office →" link in the /account rail.

## Security

- **Headers** ([next.config.ts](next.config.ts)): HSTS (2y, preload), nosniff,
  X-Frame-Options DENY, strict referrer, minimal Permissions-Policy. HTTPS and
  certificates are enforced by Vercel.
- **Forms** go through [/api/forms](src/app/api/forms/route.ts): server-side
  validation + length caps, honeypot field, per-IP rate limiting (8/10min),
  and Cloudflare Turnstile verification once `TURNSTILE_SECRET_KEY` is set.
  When `SUPABASE_SERVICE_ROLE_KEY` is configured, run the revoke block at the
  bottom of [supabase/setup.sql](supabase/setup.sql) so the route is the only
  write path.
- **CAPTCHA** widgets (newsletter / waitlist / contact / auth drawer) render
  automatically once `NEXT_PUBLIC_TURNSTILE_SITE_KEY` exists; auth passes
  `captchaToken` so Supabase → Auth → Attack protection can be enabled.
- **RLS** on all 9 tables (verified: public can only read active products and
  insert form rows; users only ever see their own cart/orders/profile/
  addresses/downloads).
- **Cookies**: Supabase session cookies are `SameSite=Lax` + `Secure` in
  production.
- **Payments/webhooks**: no payment integration yet — when checkout lands,
  webhooks must verify signatures before trusting events.

## Prototype state → production TODO

Still front-end prototypes, carried over from the design intentionally:

- **Checkout** — the cart is real, but checkout still only shows the pre-order
  note; payments (and writing `orders`) come with commerce
- `<ImageSlot>` components mark where real photography goes (Home production
  still, Shop product shot, About B&W still). Art direction: B&W / red-duotone,
  grainy, a wide range of people on and off screen. Parents already apply the
  duotone CSS filters.

## Assets

- Logos in `public/logos/` — official brand PNGs, never redraw the tiger
- Fonts in `public/fonts/` — Bebas Neue, Inter (variable), Homemade Apple
- Original design bundle in `design-handoff/` (reference only, not shipped)
