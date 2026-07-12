"use client";

import { useEffect, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function Zoomable({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
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
