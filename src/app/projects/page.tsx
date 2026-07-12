import { permanentRedirect } from "next/navigation";

// Projects was split into Films / Television / Vertical. Keep the old URL alive
// by sending it to Films so any existing links or bookmarks still land.
// Permanent (308) — the split is not coming back, so let crawlers transfer
// the old URL's equity instead of re-checking a temporary redirect.
export default function Projects() {
  permanentRedirect("/films");
}
