import {
  cn,
  capitalise,
  formatCurrency,
  truncate,
  clamp,
  randomId,
} from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    // tailwind-merge keeps the last conflicting utility
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("filters falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});

describe("capitalise()", () => {
  it("capitalises the first letter", () => {
    expect(capitalise("hello")).toBe("Hello");
  });

  it("lowercases the rest", () => {
    expect(capitalise("hELLO")).toBe("Hello");
  });

  it("returns empty string for empty input", () => {
    expect(capitalise("")).toBe("");
  });
});

describe("formatCurrency()", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(4.99)).toBe("$4.99");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles large numbers", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});

describe("truncate()", () => {
  it("returns string as-is when short enough", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings and appends ellipsis", () => {
    const result = truncate("Hello World", 6);
    expect(result).toHaveLength(6);
    expect(result.endsWith("…")).toBe(true);
  });

  it("truncates at exactly maxLength", () => {
    expect(truncate("abcde", 5)).toBe("abcde");
  });
});

describe("clamp()", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("randomId()", () => {
  it("returns a non-empty string", () => {
    expect(typeof randomId()).toBe("string");
    expect(randomId().length).toBeGreaterThan(0);
  });

  it("returns unique values", () => {
    expect(randomId()).not.toBe(randomId());
  });
});
