import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Browser-tab favicon — same mark as the social card (black tiger on brand
// red), rendered with an opaque background so it never flashes white
// between tabs the way the old transparent PNG did.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
        <img src={src} width={12} height={16} alt="" />
      </div>
    ),
    { ...size }
  );
}
