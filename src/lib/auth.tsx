"use client";

/* Auth state, backed by Supabase Auth (replaces the old localStorage prototype).
   Degrades gracefully: when Supabase isn't configured yet, `configured` is false
   and the auth actions return a friendly message instead of throwing. */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseConfigured, type createClient } from "@/lib/supabase/client";

/* @supabase/ssr (and the supabase-js it pulls in) is a real chunk of JS —
   dynamically imported here instead of statically, so it code-splits out of
   the bundle every marketing page pays for. AuthProvider wraps the whole
   site (Nav needs it for the account drawer), but most visits never touch
   auth at all. */
type SupabaseBrowserClient = ReturnType<typeof createClient>;

type AuthResult = { error: string | null; needsConfirmation?: boolean };

type AuthValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const NOT_CONFIGURED = "Sign-in isn't connected yet. Check back soon.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseBrowserClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  // Load the Supabase client lazily, after mount — keeps @supabase/ssr out
  // of the initial bundle for pages that never touch auth.
  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    import("@/lib/supabase/client").then(({ createClient }) => {
      if (!cancelled) setSupabase(createClient());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const value: AuthValue = {
    user,
    loading,
    configured: supabaseConfigured,
    signIn: async (email, password, captchaToken) => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });
      return { error: error?.message ?? null };
    },
    signUp: async (email, password, captchaToken) => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { captchaToken },
      });
      if (error) return { error: error.message };
      // With email confirmation on, there's no session until the link is clicked.
      return { error: null, needsConfirmation: !data.session };
    },
    signOut: async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
