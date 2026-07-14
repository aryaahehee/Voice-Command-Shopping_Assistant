import { PurchaseHistory } from "../models/index";
import { logger } from "../utils/logger";

const SEASONAL_MONTHS: Record<number, string[]> = {
  0:  ["oranges", "grapefruit", "kale", "sweet potatoes"],
  1:  ["blood oranges", "leeks", "Brussels sprouts"],
  2:  ["asparagus", "strawberries", "artichokes"],
  3:  ["peas", "radishes", "spinach", "rhubarb"],
  4:  ["cherries", "peas", "lettuce", "zucchini"],
  5:  ["blueberries", "peaches", "corn", "tomatoes"],
  6:  ["watermelon", "raspberries", "eggplant", "peppers"],
  7:  ["figs", "blackberries", "plums", "corn"],
  8:  ["apples", "grapes", "pumpkin", "butternut squash"],
  9:  ["pears", "cranberries", "sweet potatoes", "parsnips"],
  10: ["pomegranate", "turnips", "cauliflower"],
  11: ["clementines", "pomelo", "chestnuts"],
};

const SUBSTITUTES: Record<string, string[]> = {
  milk:    ["almond milk", "oat milk", "soy milk", "coconut milk"],
  butter:  ["margarine", "coconut oil", "olive oil", "ghee"],
  eggs:    ["flax eggs", "chia eggs", "applesauce", "silken tofu"],
  flour:   ["almond flour", "oat flour", "coconut flour", "rice flour"],
  sugar:   ["honey", "maple syrup", "agave nectar", "stevia"],
  cream:   ["coconut cream", "cashew cream", "Greek yogurt"],
  cheese:  ["nutritional yeast", "tofu", "vegan cheese"],
  beef:    ["turkey", "chicken", "lentils", "mushrooms"],
  chicken: ["tofu", "tempeh", "jackfruit", "chickpeas"],
  bread:   ["rice cakes", "corn tortillas", "lettuce wraps"],
};

const STAPLES = [
  "milk", "eggs", "bread", "butter", "bananas",
  "apples", "chicken", "rice", "pasta", "tomatoes",
];

export class RecommendationService {
  /**
   * Personalised recommendations — uses real purchase history
   * and falls back to staples for new users.
   */
  async getPersonalised(userId: string) {
    try {
      const frequent = await PurchaseHistory.getFrequentItems(userId, 10);

      if (frequent.length > 0) {
        return frequent.map((item, i) => ({
          id: `hist-${i}`,
          itemName: item.itemName,
          category: item.category,
          reason: `Purchased ${item.count} time${item.count > 1 ? "s" : ""}`,
          source: "history" as const,
          confidence: Math.min(0.95, 0.5 + item.count * 0.05),
        }));
      }

      // New user — return staples
      return STAPLES.map((name, i) => ({
        id: `staple-${i}`,
        itemName: name,
        category: "other" as const,
        reason: "Popular staple item",
        source: "history" as const,
        confidence: 0.7,
      }));
    } catch (error) {
      logger.error("getPersonalised error:", error);
      return [];
    }
  }

  async getSeasonal() {
    try {
      const month = new Date().getMonth();
      const items = SEASONAL_MONTHS[month] ?? [];
      return items.map((name, i) => ({
        id: `seasonal-${i}`,
        itemName: name,
        category: "produce" as const,
        reason: "In season right now",
        source: "seasonal" as const,
        confidence: 0.85,
      }));
    } catch (error) {
      logger.error("getSeasonal error:", error);
      return [];
    }
  }

  async getSubstitutes(itemName: string) {
    try {
      const key = itemName.toLowerCase().trim();
      const subs = SUBSTITUTES[key] ?? [];
      return {
        item: itemName,
        substitutes: subs.map((name, i) => ({
          id: `sub-${i}`,
          itemName: name,
          category: "other" as const,
          reason: `Alternative to ${itemName}`,
          source: "substitute" as const,
          confidence: Math.max(0.5, 0.85 - i * 0.08),
        })),
      };
    } catch (error) {
      logger.error("getSubstitutes error:", error);
      return { item: itemName, substitutes: [] };
    }
  }
}
