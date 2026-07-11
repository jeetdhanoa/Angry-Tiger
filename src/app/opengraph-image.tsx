import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social preview card: the brand tiger symbol centered on brand red — the
// square lockup, used as-is. Rendered to a real PNG at request time; Next
// auto-attaches it as og:image / twitter:image on every page.
export const alt = "Angry Tiger";
export const size = { width: 1200, height: 1200 };
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
        {/* Tiger symbol is 952×1229 (0.7746:1); ~50% of the canvas height,
            centered, matching the uploaded card's proportions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={465} height={600} alt="" />
      </div>
    ),
    { ...size }
  );
}
