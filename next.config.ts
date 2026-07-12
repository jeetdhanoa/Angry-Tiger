import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/* Content-Security-Policy — the browser only loads/executes resources from
   these origins, so an injected <script> or an attempt to phone data home to
   an attacker's server is refused at the browser level (defense-in-depth on
   top of React's auto-escaping and the app having no HTML-injection sinks).

   Allowlist rationale:
   - self               everything first-party (pages, /api, fonts, logos, OG)
   - challenges.cloudflare.com   Cloudflare Turnstile (CAPTCHA) script + iframe
   - *.supabase.co / wss         Supabase Auth + database + realtime
   - 'unsafe-inline' (script/style)  Next injects inline hydration scripts and
       inline styles; without a nonce these need it. Kept deliberately: the app
       renders no untrusted HTML (no dangerouslySetInnerHTML anywhere, React
       escapes all interpolation), so the residual script-injection surface is
       already nil, and this keeps every page statically cacheable. A stricter
       nonce/'strict-dynamic' policy is possible but forces per-request dynamic
       rendering — a real perf/caching cost for no meaningful gain here.
   - 'unsafe-eval'      DEV ONLY (Next's HMR needs it); never shipped to prod.
   The tight directives below (object-src none, base-uri self, form-action
   self, frame-ancestors none) are the ones that blunt real attacks and cost
   nothing. */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Security headers on every response. HTTPS itself is enforced by Vercel
// (automatic redirect + certificates); HSTS pins browsers to it.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Two years, subdomains included — browsers never try plain HTTP again.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Never MIME-sniff responses into executable types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The site has no reason to be iframed — blocks clickjacking (CSP
  // frame-ancestors covers modern browsers; this covers older ones).
  { key: "X-Frame-Options", value: "DENY" },
  // Send origin only when crossing origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these sensors/APIs.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Isolate our browsing context from any window that opened us.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version in the response headers.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
