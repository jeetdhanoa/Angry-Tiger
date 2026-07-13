"use client";

/* Once per session: black screen + red tiger, ~1100ms hold then a 250ms fade
   (sessionStorage "at-splash-seen").

   Starts in "done" so the server-rendered HTML and the first client render
   carry no splash at all — a returning visitor never gets a frame of it
   (the old code rendered the splash by default and flashed it away in an
   effect). Only a genuine first-of-session visitor flips it on, post-mount.
   The page underneath is already black, so a first-timer sees the tiger
   fade in over black, never a pop. prefers-reduced-motion skips it. */

import { useEffect, useState } from "react";

export default function Splash() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("done");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("at-splash-seen") === "1";
    } catch {}
    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      // Mark seen so the session is consistent even for reduced-motion users.
      try {
        sessionStorage.setItem("at-splash-seen", "1");
      } catch {}
      return;
    }

    setPhase("show");
    const t1 = setTimeout(() => setPhase("fade"), 1100);
    const t2 = setTimeout(() => {
      try {
        sessionStorage.setItem("at-splash-seen", "1");
      } catch {}
      setPhase("done");
    }, 1350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="splash" style={{ opacity: phase === "fade" ? 0 : 1 }}>
      <img src="/logos/at-brand-symbol-red.svg" alt="Angry Tiger" />
    </div>
  );
}
