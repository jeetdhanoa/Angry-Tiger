"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Traps Tab focus inside a dialog/drawer/overlay while `active`: moves focus
 *  into the container on open, cycles Tab/Shift+Tab at the container's
 *  edges instead of leaking out to the page behind it, and restores focus to
 *  whatever triggered the overlay once it closes. Attach the returned ref to
 *  the overlay's root element. Escape-to-close stays the caller's own
 *  concern — this hook only owns focus.
 *
 *  By default focus lands on the first focusable element inside the
 *  container (usually its own close button, since that's first in the DOM).
 *  Pass `initialFocusRef` to send focus somewhere more useful instead — e.g.
 *  a search input. */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  initialFocusRef?: React.RefObject<HTMLElement | null>
) {
  const ref = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = ref.current;
    if (!container) return;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );

    const target = initialFocusRef?.current ?? getFocusable()[0];
    (target ?? container).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
    // initialFocusRef is a ref (stable identity) — listed to satisfy the
    // exhaustive-deps rule; it never actually causes a re-run.
  }, [active, initialFocusRef]);

  return ref;
}
