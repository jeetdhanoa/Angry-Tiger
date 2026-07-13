import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { db, captchaOk } from "@/lib/server/form-defense";
import { EMAIL_RE } from "@/lib/validation";

/* All public form submissions (newsletter / waitlist / contact) come through
   this handler so they can be defended in one place:

   - honeypot field  → bots that fill every input get a silent "ok", no row
   - per-IP rate limit
   - server-side validation + length caps
   - Cloudflare Turnstile verification (active once TURNSTILE_SECRET_KEY is set)
   - inserts prefer SUPABASE_SERVICE_ROLE_KEY (server-only secret); until it's
     configured they fall back to the public anon key, same as before

   The shared defenses (db, captchaOk) live in lib/server/form-defense; the
   email rule is the same EMAIL_RE the client validates with. Once the service
   key is live in production, revoke the anon INSERT grants (see
   supabase/setup.sql notes) so this route is the *only* way in. */

const KINDS = ["newsletter", "waitlist", "contact"] as const;
type Kind = (typeof KINDS)[number];

const bad = (error: string, status = 400) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Bad request.");
  }

  const kind = body.kind as Kind;
  if (!KINDS.includes(kind)) return bad("Bad request.");

  // Honeypot: real visitors never see this field. Pretend success, store nothing.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!rateLimit(`${kind}:${ip}`)) {
    return bad("Too many tries. Give it a few minutes.", 429);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return bad("Enter a real email.");
  }

  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";
  if (!(await captchaOk(captchaToken, ip))) {
    return bad("Please confirm you're human and try again.");
  }

  const client = db("forms");
  if (!client) {
    return bad("Sending isn't connected yet. Email hello@angrytiger.in instead.", 503);
  }

  if (kind === "contact") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const story = typeof body.story === "string" ? body.story.trim() : "";
    if (!story) return bad("Tell us the story. Logline first.");
    if (story.length > 5000) return bad("Keep it under 5,000 characters for now.");
    if (name.length > 120) return bad("That name looks too long.");
    const { error } = await client.from("contact").insert({ name, email, story });
    if (error) {
      console.error("[forms/contact]", error.message);
      return bad("That didn't go through. Try again, or email hello@angrytiger.in.", 500);
    }
    return NextResponse.json({ ok: true });
  }

  if (kind === "waitlist") {
    // join_waitlist() inserts and returns the joiner's place in line
    // (rejoining returns the same number). Falls back to a plain insert
    // if the function hasn't been created yet.
    const { data: position, error } = await client.rpc("join_waitlist", {
      p_email: email,
    });
    if (!error && typeof position === "number") {
      return NextResponse.json({ ok: true, position });
    }
    const { error: insErr } = await client.from("waitlist").insert({ email });
    if (insErr && insErr.code !== "23505") {
      console.error("[forms/waitlist]", (error ?? insErr).message);
      return bad("That didn't go through. Try again, or email hello@angrytiger.in.", 500);
    }
    return NextResponse.json({ ok: true });
  }

  const { error } = await client.from(kind).insert({ email });
  // Unique violation = already subscribed — that reads as success.
  if (error && error.code !== "23505") {
    console.error(`[forms/${kind}]`, error.message);
    return bad("That didn't go through. Try again, or email hello@angrytiger.in.", 500);
  }
  return NextResponse.json({ ok: true });
}
