import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./client";

// Server-side Supabase client for Server Components and Route Handlers.
// Reads/writes the session from cookies. Use in server code that needs the
// signed-in user (e.g. a future account page or protected route).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore; the middleware
          // refresh keeps the session cookie current.
        }
      },
    },
  });
}
