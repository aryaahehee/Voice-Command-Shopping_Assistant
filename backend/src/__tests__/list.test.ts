/**
 * ListService unit tests — tests logic that doesn't need a live DB.
 */

jest.mock("../models/index", () => ({
  ShoppingList: {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  },
  PurchaseHistory: { create: jest.fn() },
  detectCategory: jest.fn((name: string) => {
    if (name.toLowerCase().includes("milk")) return "dairy";
    if (name.toLowerCase().includes("apple")) return "produce";
    return "other";
  }),
}));

jest.mock("../utils/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { detectCategory } from "../models/ShoppingList";

describe("detectCategory (via model)", () => {
  it("categorises milk as dairy", () => {
    expect(detectCategory("oat milk")).toBe("dairy");
  });

  it("categorises apple as produce", () => {
    expect(detectCategory("green apple")).toBe("produce");
  });

  it("falls back to other for unknowns", () => {
    expect(detectCategory("unknown item xyz")).toBe("other");
  });
});
