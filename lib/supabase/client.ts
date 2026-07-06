import { createBrowserClient } from "@supabase/ssr";

// The anon key and URL are public by design (the anon key is the browser-safe
// "publishable" key). Both are read from NEXT_PUBLIC_ env vars, inlined at build.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// True once both env vars are set. Until then the app runs in a graceful
// "auth not connected" mode so nothing breaks before Supabase is configured.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
