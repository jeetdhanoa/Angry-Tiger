"use client";

/* Last line of defense — catches an error in the root layout itself, where the
   normal layout (and its CSS) can't be trusted to have loaded. So it renders
   its own <html>/<body> and inlines the brand's minimal look, still in the
   house voice. Deliberately dependency-free and self-contained. */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#000",
          color: "#f4f1e7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "40px",
          textAlign: "center",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/at-brand-symbol-red.svg" alt="" width={72} height={72} />
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c90e0e",
          }}
        >
          Cut · Something broke
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05 }}>
          The reel jammed.
        </h1>
        <p style={{ margin: 0, maxWidth: "42ch", opacity: 0.8, lineHeight: 1.5 }}>
          Something went wrong loading Angry Tiger. Reload the take — if it keeps
          breaking, the tiger will hear about it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "8px",
            background: "#c90e0e",
            color: "#000",
            border: "none",
            borderRadius: 0,
            padding: "14px 32px",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
