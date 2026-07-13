import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "./client";

// Refreshes the Supabase session on every request so server-rendered pages and
// route handlers see a current user. No-ops until Supabase is configured, so
// the site keeps working before the env vars are set.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) return response;

  // No Supabase cookie at all means an anonymous visitor — skip the network
  // round-trip to Supabase entirely rather than asking it to confirm what
  // the request already tells us. Belt-and-braces alongside the middleware
  // matcher only running this on /account and /admin.
  const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasAuthCookie) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the user to trigger a token refresh when needed.
  await supabase.auth.getUser();

  return response;
}
