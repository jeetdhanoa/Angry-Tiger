"use client";

/* Form delivery — writes to Supabase tables (see supabase/setup.sql).
   Row-level security allows inserts only; submissions are read in the
   Supabase dashboard. Every helper resolves to { ok } or { ok, error }
   so the forms can keep the design's confirmation states. */

import { createClient, supabaseConfigured } from "@/lib/supabase/client";

export type SubmitResult = { ok: boolean; error?: string };

const NOT_CONFIGURED =
  "Sending isn't connected yet. Email hello@angrytiger.in instead.";
const GENERIC_FAIL =
  "That didn't go through. Try again, or email hello@angrytiger.in.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Unique-violation on the email column: they're already on the list —
// treat as success so the UI confirms rather than complains.
const DUPLICATE = "23505";

async function insertEmail(
  table: "newsletter" | "waitlist",
  email: string
): Promise<SubmitResult> {
  if (!validEmail(email)) return { ok: false, error: "Enter a real email." };
  if (!supabaseConfigured) return { ok: false, error: NOT_CONFIGURED };
  try {
    const { error } = await createClient()
      .from(table)
      .insert({ email: email.trim().toLowerCase() });
    if (error && error.code !== DUPLICATE) {
      console.error(`[${table}]`, error.message);
      return { ok: false, error: GENERIC_FAIL };
    }
    return { ok: true };
  } catch (e) {
    console.error(`[${table}]`, e);
    return { ok: false, error: GENERIC_FAIL };
  }
}

export function joinNewsletter(email: string): Promise<SubmitResult> {
  return insertEmail("newsletter", email);
}

export function joinWaitlist(email: string): Promise<SubmitResult> {
  return insertEmail("waitlist", email);
}

export async function submitContact(fields: {
  name: string;
  email: string;
  story: string;
}): Promise<SubmitResult> {
  if (!validEmail(fields.email)) return { ok: false, error: "Enter a real email." };
  if (!fields.story.trim())
    return { ok: false, error: "Tell us the story. Logline first." };
  if (!supabaseConfigured) return { ok: false, error: NOT_CONFIGURED };
  try {
    const { error } = await createClient().from("contact").insert({
      name: fields.name.trim(),
      email: fields.email.trim().toLowerCase(),
      story: fields.story.trim(),
    });
    if (error) {
      console.error("[contact]", error.message);
      return { ok: false, error: GENERIC_FAIL };
    }
    return { ok: true };
  } catch (e) {
    console.error("[contact]", e);
    return { ok: false, error: GENERIC_FAIL };
  }
}
