import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

// Parked for launch. The full shop lives in page.full.tsx — swap the filenames
// back (page.full.tsx → page.tsx) to re-enable it.
export const metadata: Metadata = {
  title: "The Shop — Coming soon",
  description: "The Angry Tiger shop opens with our first release.",
  // Parked pages shouldn't compete with real routes for a Google spot — the
  // sitemap already omits them, but robots.ts only blocks /admin /account
  // /api, so this page was crawlable and indexable with a "Coming soon"
  // title until now.
  robots: { index: false, follow: true },
};

export default function ShopPage() {
  return (
    <ComingSoon
      eyebrow="The Shop"
      line="The shop opens alongside our first release. One drop at a time."
    />
  );
}
