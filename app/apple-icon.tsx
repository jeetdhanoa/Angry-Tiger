import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// iOS home-screen icon — same mark, larger canvas (Apple's recommended
// 180x180), same opaque red so it never shows a transparency checkerboard.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={70} height={90} alt="" />
      </div>
    ),
    { ...size }
  );
}
