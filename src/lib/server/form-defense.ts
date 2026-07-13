/* Server-only defenses shared by the form route handlers (/api/forms,
   /api/careers). Keep this out of any client bundle — it reads the
   service-role secret. */

import { createClient } from "@supabase/supabase-js";

/** Supabase client for a form route: prefers the server-only service-role
 *  key, falls back to the public anon key until it's configured (logging a
 *  production warning while it does — see the README launch checklist).
 *  `label` names the caller in that warning. Returns null if Supabase isn't
 *  configured at all. */
export function db(label: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VERCEL_ENV === "production") {
    console.warn(
      `[${label}] production is running on the anon key — see README launch checklist`
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Cloudflare Turnstile verification. Passes through (true) until
 *  TURNSTILE_SECRET_KEY is set, so forms work before CAPTCHA is enabled. */
export async function captchaOk(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // CAPTCHA not enabled yet
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}
