"use client";

import { useEffect } from "react";

/* Locks page scroll while an overlay is open, so the page behind a modal
   (mobile menu, search, account drawer, lightbox) can't scroll through —
   the classic mobile-overlay bug. A module-level counter composes cleanly
   across independent overlays: the lock is applied when the first opens and
   released only when the last closes, so two overlays never fight over
   document.body's overflow. */

let openCount = 0;
let previousOverflow = "";

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (openCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openCount += 1;
    return () => {
      openCount -= 1;
      if (openCount === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
