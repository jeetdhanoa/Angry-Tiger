"use client";

import { useEffect, useState } from "react";

export default function Zoomable({
  src,
  alt,
  caption,
  children,
}: {
  src: string;
  alt: string;
  caption: string;
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
          {/* Same still-tag / photo-mark watermark as the thumbnail — carries
              over into the enlarged view instead of disappearing. */}
          <div className="lightbox__frame">
            <img src={src} alt={alt} className="lightbox__img" />
            <span className="still-tag">{caption}</span>
            <img
              src="/logos/at-brand-symbol-red.svg"
              alt=""
              aria-hidden="true"
              className="photo-mark"
            />
          </div>
        </div>
      )}
    </>
  );
}
