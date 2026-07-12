"use client";

import { useEffect, useState } from "react";

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
      <div className="zoomable" onClick={() => setOpen(true)}>
        {children}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(false)}>
          <button type="button" className="lightbox__close" aria-label="Close">
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
