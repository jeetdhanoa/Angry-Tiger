import { describe, it, expect } from "vitest";
import { validEmail, EMAIL_RE } from "@/lib/validation";

describe("validEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(validEmail("jane@example.com")).toBe(true);
    expect(validEmail("a.b+tag@sub.domain.co.in")).toBe(true);
  });

  it("trims surrounding whitespace before checking", () => {
    expect(validEmail("  jane@example.com  ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(validEmail("")).toBe(false);
    expect(validEmail("jane")).toBe(false);
    expect(validEmail("jane@")).toBe(false);
    expect(validEmail("@example.com")).toBe(false);
    expect(validEmail("jane@example")).toBe(false); // no TLD dot
    expect(validEmail("jane @example.com")).toBe(false); // internal space
    expect(validEmail("jane@ex ample.com")).toBe(false);
  });

  it("EMAIL_RE is anchored (no partial matches)", () => {
    expect(EMAIL_RE.test("prefix jane@example.com suffix")).toBe(false);
  });
});
