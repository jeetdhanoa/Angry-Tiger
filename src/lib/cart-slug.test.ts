import { describe, it, expect } from "vitest";
import { legacySlug } from "@/lib/cart-slug";

describe("legacySlug", () => {
  it("resolves a known legacy prefix to its catalog slug", () => {
    expect(legacySlug("tee-m")).toBe("tiger-tee");
    expect(legacySlug("tee-xl")).toBe("tiger-tee");
    expect(legacySlug("TEE-L")).toBe("tiger-tee"); // case-insensitive prefix
  });

  it("returns null for an unknown prefix", () => {
    expect(legacySlug("hoodie-m")).toBeNull();
  });

  it("returns null for ids without a prefix-dash shape", () => {
    expect(legacySlug("teem")).toBeNull();
    expect(legacySlug("")).toBeNull();
    expect(legacySlug("123-m")).toBeNull(); // prefix must be alpha
  });
});
