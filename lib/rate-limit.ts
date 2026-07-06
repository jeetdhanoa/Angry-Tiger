/* Per-IP sliding-window rate limiter for route handlers.

   In-memory: on Vercel's Fluid Compute, function instances are reused across
   requests, so this meaningfully throttles bursts from a single source. For
   hard multi-instance guarantees, add a Vercel WAF rate-limit rule (dashboard)
   or a shared store (e.g. Upstash) later — the call site stays the same. */

const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  max = 8,
  windowMs = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  // Keep the map bounded if a scraper cycles IPs.
  if (buckets.size > 5000) {
    for (const k of buckets.keys()) {
      if (buckets.size <= 4000) break;
      buckets.delete(k);
    }
  }
  return true;
}
