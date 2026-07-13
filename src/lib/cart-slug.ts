/* Legacy local cart ids were "<prefix>-<size>" (e.g. "tee-m"); this resolves
   the prefix to a catalog slug during the sign-in cart merge. Pulled out of
   lib/cart into its own dependency-free module so it can be unit-tested
   without dragging React/Supabase into the test env. */

export const LEGACY_SLUGS: Record<string, string> = { tee: "tiger-tee" };

export function legacySlug(id: string): string | null {
  const m = /^([a-z]+)-/i.exec(id);
  return m ? (LEGACY_SLUGS[m[1].toLowerCase()] ?? null) : null;
}
