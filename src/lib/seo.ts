import type { Metadata } from "next";

/* Per-page metadata with the social card attached.

   Next merges `openGraph` / `twitter` objects by REPLACEMENT, not deep-merge:
   a page that sets `openGraph: { title, description, url }` silently drops
   the root layout's card image and `summary_large_image` type. Production
   proved it — /about, /films, /television, /vertical shared with no picture,
   and every page fell back to the small `summary` card. Every page-level
   metadata export goes through here so the card can't be lost again. The
   image routes are src/app/opengraph-image.tsx and twitter-image.tsx. */

const CARD = { url: "/opengraph-image", width: 1200, height: 630, alt: "Angry Tiger" };

export function pageMeta(
  title: string,
  description: string,
  path: string,
  extra: Metadata = {}
): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, url: path, images: [CARD] },
    twitter: { card: "summary_large_image", title, description, images: ["/twitter-image"] },
    ...extra,
  };
}
