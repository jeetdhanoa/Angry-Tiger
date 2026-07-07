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

## Authentication (Supabase Auth)

Account sign-in / sign-up runs on **Supabase Auth** (email + password), wired
through `@supabase/ssr`:

- `lib/supabase/client.ts` — browser client + `supabaseConfigured` flag
- `lib/supabase/server.ts` — server client (Server Components / Route Handlers)
- `lib/supabase/middleware.ts` + `middleware.ts` — refresh the session per request
- `lib/auth.tsx` — `AuthProvider` / `useAuth()` (`signIn`, `signUp`, `signOut`, `user`)
- The account drawer in `components/Nav.tsx` consumes `useAuth()`

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
`waitlist_signups`, `contact_submissions`) via `lib/submissions.ts`.
One-time setup: run [supabase/setup.sql](supabase/setup.sql) in the Supabase
SQL Editor — it creates the tables with insert-only RLS (visitors can write,
nothing is readable through the public API). Read submissions in
Supabase → Table Editor. Duplicate newsletter/waitlist emails read as success.

## Cart & catalog (Supabase)

- **Products** load from the public `products` table (`lib/products.ts`), with a
  built-in fallback so the shop renders even before Supabase answers.
- **Cart** (`lib/cart.tsx`): signed-in users get rows in the `cart` table — the
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
client. Grant yourself access: sign up on the site, then in the SQL Editor:
`update public.profiles set is_admin = true where email = 'you@example.com';`
Admins also get a "The office →" link in the /account rail.

## Security

- **Headers** ([next.config.ts](next.config.ts)): HSTS (2y, preload), nosniff,
  X-Frame-Options DENY, strict referrer, minimal Permissions-Policy. HTTPS and
  certificates are enforced by Vercel.
- **Forms** go through [/api/forms](app/api/forms/route.ts): server-side
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
