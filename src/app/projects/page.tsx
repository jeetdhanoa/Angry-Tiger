import { redirect } from "next/navigation";

// Projects was split into Films / Television / Vertical. Keep the old URL alive
// by sending it to Films so any existing links or bookmarks still land.
export default function Projects() {
  redirect("/films");
}
