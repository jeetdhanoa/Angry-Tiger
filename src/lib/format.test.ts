import { describe, it, expect } from "vitest";
import { rupees } from "@/lib/format";

describe("rupees", () => {
  it("prefixes the rupee sign", () => {
    expect(rupees(0)).toBe("₹0");
    expect(rupees(500)).toBe("₹500");
  });

  it("groups digits in the Indian system (lakh/crore)", () => {
    expect(rupees(1500)).toBe("₹1,500");
    expect(rupees(100000)).toBe("₹1,00,000");
    expect(rupees(10000000)).toBe("₹1,00,00,000");
  });
});
