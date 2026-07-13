import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Defense-in-depth for /admin: the real gate is RLS + the domain-locked
  // is_admin() check, and the shell already refuses to render for non-admins.
  // But a logged-out visitor with no Supabase cookie has no business loading
  // the admin shell at all — bounce them to the home page before it mounts.
  // (/account is deliberately NOT gated here: it needs to render its own
  // sign-in prompt for logged-out users.)
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));
  if (request.nextUrl.pathname.startsWith("/admin") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return await updateSession(request);
}

export const config = {
  // updateSession only refreshes the Supabase auth cookie — nothing else in
  // this file has a site-wide effect. The only pages that read that cookie
  // (client-side, via useAuth()) are /account and /admin, so every public
  // marketing route was paying an Edge Function invocation + a Supabase
  // round-trip for a refresh nobody consumed. Narrowed to just the two
  // routes that actually need it.
  matcher: ["/account/:path*", "/admin/:path*"],
};
