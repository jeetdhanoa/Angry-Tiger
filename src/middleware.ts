import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
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
