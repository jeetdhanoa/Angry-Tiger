import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social preview card: the brand tiger symbol centered on brand red.
// 1200×630 — the standard large-card ratio; a square card gets cropped
// unpredictably by X/Slack/iMessage under `summary_large_image`.
// Rendered to a real PNG at request time; Next auto-attaches it as
// og:image / twitter:image on every page.
export const alt = "Angry Tiger";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const tiger = await readFile(
    join(process.cwd(), "public/logos/at-brand-symbol-black.png")
  );
  const src = `data:image/png;base64,${tiger.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#c90e0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Tiger symbol is 952×1229 (0.7746:1); ~70% of the canvas height,
            centered, with clear space above and below. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={341} height={440} alt="" />
      </div>
    ),
    { ...size }
  );
}
