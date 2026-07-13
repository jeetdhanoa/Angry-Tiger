/* Presentation helpers with no dependencies — safe to import anywhere without
   dragging heavier modules along. `rupees` used to live in lib/cart, which
   pulled the whole cart (and its Supabase deps) into the admin bundles that
   only needed to format a price. */

/** Whole-rupee amount, Indian digit grouping. e.g. 1500 -> "₹1,500". */
export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
