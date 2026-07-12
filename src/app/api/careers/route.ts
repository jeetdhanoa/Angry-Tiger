import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";

/* The Production page's join-the-house application (crew / cast / creative),
   with an optional CV upload. Multipart rather than JSON (files), so it gets
   its own route, but the defenses mirror /api/forms:

   - honeypot field  → bots that fill every input get a silent "ok", no row
   - per-IP rate limit (tighter than the text forms — uploads are heavier)
   - server-side validation + length caps
   - Cloudflare Turnstile verification (active once TURNSTILE_SECRET_KEY is set)
   - CV: PDF/DOC/DOCX only, 4MB cap (Vercel's request limit is ~4.5MB),
     stored under a random name in the PRIVATE `cvs` bucket — the original
     filename is kept as data in the row, never used as a path
   - inserts/uploads prefer SUPABASE_SERVICE_ROLE_KEY; until it's configured
     they fall back to the anon key + the staged RLS grants in setup.sql §11 */

const bad = (error: string, status = 400) =>
  NextResponse.json({ ok: false, error }, { status });

const GENERIC =
  "That didn't go through. Try again, or email production@angrytiger.in with your CV.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KINDS = ["crew", "cast", "creative"] as const;

const MAX_CV_BYTES = 4 * 1024 * 1024;
const CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const CV_EXTS = new Set(["pdf", "doc", "docx"]);

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VERCEL_ENV === "production") {
    // Launch checklist: until the service key is set AND the setup.sql §7/§11
    // anon-INSERT revokes run, this route's defenses can be bypassed by
    // POSTing straight to Supabase REST with the public anon key.
    console.warn("[careers] production is running on the anon key — see README launch checklist");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function captchaOk(token: string, ip: string): Promise<boolean> {
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

const field = (fd: FormData, name: string, max: number) => {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

export async function POST(req: NextRequest) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return bad("Bad request.");
  }

  // Honeypot: real visitors never see this field. Pretend success, store nothing.
  if (field(fd, "website", 200)) {
    return NextResponse.json({ ok: true });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!rateLimit(`careers:${ip}`, 4)) {
    return bad("Too many tries. Give it a few minutes.", 429);
  }

  const kind = field(fd, "kind", 20) as (typeof KINDS)[number];
  if (!KINDS.includes(kind)) return bad("Bad request.");

  const name = field(fd, "name", 120);
  if (!name) return bad("Tell us your name.");

  const email = field(fd, "email", 254).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return bad("Enter a real email.");

  const discipline = field(fd, "discipline", 120);
  if (!discipline) return bad("Tell us what you do. One line is enough.");

  const link = field(fd, "link", 300);
  const message = field(fd, "message", 5000);

  if (!(await captchaOk(field(fd, "captchaToken", 4096), ip))) {
    return bad("Please confirm you're human and try again.");
  }

  const client = db();
  if (!client) {
    return bad("Applications aren't connected yet. Email production@angrytiger.in.", 503);
  }

  // Optional CV. Random storage name; the visitor's filename is data, not a path.
  let cv_path: string | null = null;
  let cv_name: string | null = null;
  const cv = fd.get("cv");
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX_CV_BYTES) return bad("Keep the CV under 4MB.");
    const ext = (cv.name.split(".").pop() ?? "").toLowerCase();
    if (!CV_TYPES.has(cv.type) && !CV_EXTS.has(ext)) {
      return bad("CVs as PDF or Word documents only.");
    }
    const path = `${randomUUID()}.${CV_EXTS.has(ext) ? ext : "pdf"}`;
    const { error: upErr } = await client.storage
      .from("cvs")
      .upload(path, await cv.arrayBuffer(), {
        contentType: CV_TYPES.has(cv.type) ? cv.type : "application/pdf",
      });
    if (upErr) {
      console.error("[careers/upload]", upErr.message);
      return bad(GENERIC, 500);
    }
    cv_path = path;
    cv_name = cv.name.slice(0, 140);
  }

  const { error } = await client
    .from("careers")
    .insert({ kind, name, email, discipline, link, message, cv_path, cv_name });
  if (error) {
    console.error("[careers]", error.message);
    return bad(GENERIC, 500);
  }
  return NextResponse.json({ ok: true });
}
