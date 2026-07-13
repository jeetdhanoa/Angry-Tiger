"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Replays a short cinematic "enter" on the incoming page — but only on
   navigations, not the first paint (that's the splash's moment, and the home
   hero already carries its own film-frame open). Keying the inner wrapper on
   the pathname unmounts the old subtree and mounts the new one, restarting the
   CSS animation (.route-enter). The exiting page isn't animated out — a cut
   in, with a settle, reads as intentional without a full cross-fade's jank.
   The wrapper's transform resolves to none once the animation ends
   (fill-mode: both), so it never leaves a lingering containing block over
   fixed descendants. prefers-reduced-motion drops the animation (CSS). */
export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstPaint = useRef(true);
  const animate = !firstPaint.current;

  useEffect(() => {
    firstPaint.current = false;
  }, [pathname]);

  return (
    <div key={pathname} className={animate ? "route-enter" : undefined}>
      {children}
    </div>
  );
}
