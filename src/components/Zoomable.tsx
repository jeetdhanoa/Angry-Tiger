"use client";

import { useEffect, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useScrollLock } from "@/lib/useScrollLock";

export default function Zoomable({
  src,
  alt,
  revealFrame = false,
  children,
}: {
  src: string;
  alt: string;
  /** Reveal this still as a film frame (letterbox slit → full frame) when it
   *  scrolls into view — the motion engine picks up the data attribute. */
  revealFrame?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);
  // Shared counter-based lock (composes with the Nav overlays) instead of
  // writing document.body.style directly, which could clobber another
  // overlay's lock.
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* display: contents keeps this out of the surrounding grid/flex
          layout — a <button> here still triggers on click same as the div
          did, but is now reachable and activatable by keyboard. */}
      <button
        type="button"
        className="zoomable"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge photo: ${alt}`}
        {...(revealFrame ? { "data-reveal-frame": "" } : {})}
      >
        {children}
      </button>
      {open && (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          {/* The still-number and brand symbol are burned into the JPEG
              itself (see scripts/burn-watermark.py) — this is just the
              image, no separate overlay needed. */}
          <img src={src} alt={alt} className="lightbox__img" />
        </div>
      )}
    </>
  );
}
