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
};

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
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    });
    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [onToken]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} />;
}
