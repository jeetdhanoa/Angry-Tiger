import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

// Parked for launch. The full membership page (The Ambush) lives in
// page.full.tsx — swap the filenames back (page.full.tsx → page.tsx) to
// re-enable it. This page's metadata overrides the layout's for now.
export const metadata: Metadata = {
  title: "The Ambush — Coming soon",
  description: "Angry Tiger membership opens alongside our first release.",
  robots: { index: false, follow: true },
};

export default function MembershipPage() {
  return (
    <ComingSoon
      eyebrow="The Ambush"
      line="Membership opens alongside our first release. Founding members go first."
    />
  );
}
