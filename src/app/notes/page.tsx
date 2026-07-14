import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

// Parked for launch. The full Notes page lives in page.full.tsx — swap the
// filenames back (page.full.tsx → page.tsx) to re-enable it.
export const metadata: Metadata = {
  title: "Notes — Coming soon",
  description: "Letters, conversations and the Angry Tiger podcast. Coming soon.",
  robots: { index: false, follow: true },
};

export default function NotesPage() {
  return (
    <ComingSoon
      eyebrow="Notes"
      line="Letters, conversations and the Angry Tiger podcast. New words land here with our first release."
    />
  );
}
