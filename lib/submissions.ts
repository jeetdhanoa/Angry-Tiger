"use client";

/* Form delivery — everything posts to /api/forms, which validates, rate
   limits, checks the honeypot and (when configured) Turnstile before writing
   to Supabase. The forms keep the design's confirmation states. */

export type SubmitResult = { ok: boolean; error?: string };

export type FormExtras = {
  /** Honeypot field value — real users never fill it. */
  website?: string;
  /** Turnstile token when the CAPTCHA widget is active. */
  captchaToken?: string;
};

const GENERIC_FAIL =
  "That didn't go through. Try again, or email hello@angrytiger.in.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

async function post(payload: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error ?? GENERIC_FAIL };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: GENERIC_FAIL };
  }
}

export function joinNewsletter(email: string, extras: FormExtras = {}): Promise<SubmitResult> {
  if (!validEmail(email)) return Promise.resolve({ ok: false, error: "Enter a real email." });
  return post({ kind: "newsletter", email, ...extras });
}

export function joinWaitlist(email: string, extras: FormExtras = {}): Promise<SubmitResult> {
  if (!validEmail(email)) return Promise.resolve({ ok: false, error: "Enter a real email." });
  return post({ kind: "waitlist", email, ...extras });
}

export function submitContact(
  fields: { name: string; email: string; story: string },
  extras: FormExtras = {}
): Promise<SubmitResult> {
  if (!validEmail(fields.email))
    return Promise.resolve({ ok: false, error: "Enter a real email." });
  if (!fields.story.trim())
    return Promise.resolve({ ok: false, error: "Tell us the story. Logline first." });
  return post({ kind: "contact", ...fields, ...extras });
}
