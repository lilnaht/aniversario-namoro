import { describe, expect, it } from "vitest";
import { letterSchema, quoteSchema, reasonSchema } from "@/lib/validation";

describe("validation", () => {
  it("rejects empty quote", () => {
    expect(() => quoteSchema.parse({ text: "" })).toThrow();
  });

  it("accepts valid reason", () => {
    const result = reasonSchema.parse({ text: "Seu sorriso", position: 1 });
    expect(result.text).toBe("Seu sorriso");
  });

  it("rejects missing letter content", () => {
    expect(() =>
      letterSchema.parse({ date: "2024-01-01", content: "", title: null }),
    ).toThrow();
  });
});
