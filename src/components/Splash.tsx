"use client";

/* Once per session: black screen + red tiger + micro wordmark, 1100ms hold
   then 250ms fade (sessionStorage "at-splash-seen"). */

import { useEffect, useState } from "react";

export default function Splash() {
  const [phase, setPhase] = useState<"init" | "show" | "fade" | "done">("init");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("at-splash-seen") === "1";
    } catch {}
    if (seen) {
      setPhase("done");
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

  return (
    <>
      {(phase === "show" || phase === "fade" || phase === "init") && (
        <div className="splash" style={{ opacity: phase === "fade" ? 0 : 1 }}>
          <img src="/logos/at-brand-symbol-red.svg" alt="Angry Tiger" />
        </div>
      )}
    </>
  );
}
