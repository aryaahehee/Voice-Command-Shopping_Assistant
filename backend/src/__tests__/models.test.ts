/**
 * Unit tests for model helpers that don't need a live DB.
 */
import { detectCategory } from "../models/ShoppingList";

describe("detectCategory()", () => {
  it("detects dairy products", () => {
    expect(detectCategory("whole milk")).toBe("dairy");
    expect(detectCategory("cheddar cheese")).toBe("dairy");
  });

  it("detects produce", () => {
    expect(detectCategory("ripe bananas")).toBe("produce");
    expect(detectCategory("red apples")).toBe("produce");
  });

  it("detects bakery items", () => {
    expect(detectCategory("sourdough bread")).toBe("bakery");
    expect(detectCategory("chocolate muffin")).toBe("bakery");
  });

  it("detects meat", () => {
    expect(detectCategory("chicken breast")).toBe("meat");
    expect(detectCategory("beef mince")).toBe("meat");
  });

  it("falls back to 'other' for unknown items", () => {
    expect(detectCategory("widget")).toBe("other");
    expect(detectCategory("thingamajig")).toBe("other");
  });
});
