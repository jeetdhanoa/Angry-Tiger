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
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

type AuthResult = { error: string | null; needsConfirmation?: boolean };

type AuthValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const NOT_CONFIGURED = "Sign-in isn't connected yet. Check back soon.";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Create the client once; null until Supabase is configured.
  const [supabase] = useState(() => (supabaseConfigured ? createClient() : null));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

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
    signIn: async (email, password) => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signUp: async (email, password) => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { data, error } = await supabase.auth.signUp({ email, password });
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
