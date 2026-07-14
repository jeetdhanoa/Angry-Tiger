"use client";

import { useEffect, useLayoutEffect } from "react";
import { initMotion } from "@/lib/motion";

/* useEffect fires after the browser paints — so on a hard load, the reveal
   engine's initial "hide reveal-eligible content" step ran one paint too
   late: SSR content showed fully visible for a frame, then went to
   opacity:0, then reappeared once settle() ran. useLayoutEffect fires
   synchronously before that first paint instead, so the hide (and the rest
   of initMotion's DOM prep) is already done by the time anything renders —
   no flash. Guarded for SSR (useLayoutEffect warns if it runs server-side;
   this component's effect body never does, since Next only invokes it in
   the browser, but the hook reference itself must still resolve safely
   during the server render pass). The reveal engine's own logic — geometry
   trigger, stagger, 2s safety net — is completely unchanged; only when this
   first pass fires is different. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Motion() {
  useIsomorphicLayoutEffect(() => {
    initMotion();
  }, []);
  return null;
}
