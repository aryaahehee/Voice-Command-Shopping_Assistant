/**
 * RecommendationService unit tests — no DB required.
 */

jest.mock("../models/index", () => ({
  PurchaseHistory: {
    getFrequentItems: jest.fn().mockResolvedValue([
      { itemName: "Milk", category: "dairy", count: 5 },
      { itemName: "Eggs", category: "dairy", count: 3 },
      { itemName: "Bread", category: "bakery", count: 2 },
    ]),
  },
}));

jest.mock("../utils/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { RecommendationService } from "../services/recommendation.service";

const svc = new RecommendationService();

describe("RecommendationService", () => {
  describe("getPersonalised()", () => {
    it("returns recommendations from purchase history", async () => {
      const recs = await svc.getPersonalised("user123");
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0].itemName).toBe("Milk");
      expect(recs[0].source).toBe("history");
    });

    it("includes confidence based on purchase count", async () => {
      const recs = await svc.getPersonalised("user123");
      // Milk (count=5) should have higher confidence than Bread (count=2)
      expect(recs[0].confidence).toBeGreaterThan(recs[2].confidence);
    });
  });

  describe("getSeasonal()", () => {
    it("returns seasonal items for the current month", async () => {
      const items = await svc.getSeasonal();
      expect(Array.isArray(items)).toBe(true);
      // Every item should have the seasonal source
      items.forEach((item) => expect(item.source).toBe("seasonal"));
    });

    it("returns items with produce category", async () => {
      const items = await svc.getSeasonal();
      items.forEach((item) => expect(item.category).toBe("produce"));
    });
  });

  describe("getSubstitutes()", () => {
    it("returns substitutes for milk", async () => {
      const result = await svc.getSubstitutes("milk");
      expect(result.item).toBe("milk");
      expect(result.substitutes.length).toBeGreaterThan(0);
      expect(result.substitutes[0].itemName).toBe("almond milk");
    });

    it("returns empty substitutes for unknown items", async () => {
      const result = await svc.getSubstitutes("xyzzy");
      expect(result.substitutes).toHaveLength(0);
    });

    it("is case-insensitive", async () => {
      const r1 = await svc.getSubstitutes("Butter");
      const r2 = await svc.getSubstitutes("butter");
      expect(r1.substitutes.length).toBe(r2.substitutes.length);
    });

    it("decreasing confidence for lower-ranked substitutes", async () => {
      const result = await svc.getSubstitutes("milk");
      const confidences = result.substitutes.map((s) => s.confidence);
      for (let i = 1; i < confidences.length; i++) {
        expect(confidences[i]).toBeLessThanOrEqual(confidences[i - 1]);
      }
    });
  });
});
