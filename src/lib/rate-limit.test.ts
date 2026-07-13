import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to `max` hits then blocks within the window", () => {
    const key = "ip-a";
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(false); // 4th within window
  });

  it("keeps separate buckets per key", () => {
    expect(rateLimit("ip-b", 1, 1000)).toBe(true);
    expect(rateLimit("ip-b", 1, 1000)).toBe(false);
    expect(rateLimit("ip-c", 1, 1000)).toBe(true); // different key unaffected
  });

  it("frees up as old hits slide out of the window", () => {
    const key = "ip-d";
    expect(rateLimit(key, 2, 1000)).toBe(true); // t=0
    expect(rateLimit(key, 2, 1000)).toBe(true); // t=0
    expect(rateLimit(key, 2, 1000)).toBe(false); // blocked

    vi.setSystemTime(1001); // both prior hits are now older than the window
    expect(rateLimit(key, 2, 1000)).toBe(true);
    expect(rateLimit(key, 2, 1000)).toBe(true);
    expect(rateLimit(key, 2, 1000)).toBe(false);
  });

  it("partial expiry frees exactly one slot", () => {
    const key = "ip-e";
    expect(rateLimit(key, 2, 1000)).toBe(true); // t=0
    vi.setSystemTime(600);
    expect(rateLimit(key, 2, 1000)).toBe(true); // t=600
    expect(rateLimit(key, 2, 1000)).toBe(false); // full
    vi.setSystemTime(1001); // only the t=0 hit expired; t=600 still counts
    expect(rateLimit(key, 2, 1000)).toBe(true); // one slot freed
    expect(rateLimit(key, 2, 1000)).toBe(false); // full again
  });
});
