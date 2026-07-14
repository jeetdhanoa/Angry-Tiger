"use client";

/* Cloudflare Turnstile widget (CAPTCHA). Renders nothing until
   NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so it can ship dormant and light up
   when the keys are configured. Server verification lives in /api/forms
   (TURNSTILE_SECRET_KEY); Supabase Auth uses its own verification once
   CAPTCHA protection is enabled in the dashboard. */

import { useEffect, useRef } from "react";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileAPI = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

/* Tokens are single-use: once a submit consumes one, the widget must issue a
   fresh token or every retry re-sends the spent one and the user is stuck.
   Active widgets register here; lib/submissions calls resetTurnstiles() after
   each post so retries always carry a live token. */
const activeWidgets = new Set<string>();

export function resetTurnstiles() {
  for (const id of activeWidgets) {
    try {
      window.turnstile?.reset(id);
    } catch {
      // Widget already gone (unmounted mid-flight) — nothing to reset.
    }
  }
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
    __atTurnstileLoader?: Promise<void>;
  }
}

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!window.__atTurnstileLoader) {
    window.__atTurnstileLoader = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
  }
  return window.__atTurnstileLoader;
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let widgetId: string | undefined;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        // Responsive width — fills the container instead of a fixed 300px
        // iframe that overflowed the auth drawer / form cards on phones.
        size: "flexible",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
      activeWidgets.add(widgetId);
    });
    return () => {
      cancelled = true;
      if (widgetId) {
        activeWidgets.delete(widgetId);
        window.turnstile?.remove(widgetId);
      }
    };
  }, [onToken]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div className="turnstile-slot" ref={ref} />;
}
