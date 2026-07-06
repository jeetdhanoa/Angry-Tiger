import type { NextConfig } from "next";

// Security headers on every response. HTTPS itself is enforced by Vercel
// (automatic redirect + certificates); HSTS pins browsers to it.
const securityHeaders = [
  // Two years, subdomains included — browsers never try plain HTTP again.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Never MIME-sniff responses into executable types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The site has no reason to be iframed — blocks clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  // Send origin only when crossing origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these sensors/APIs.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
