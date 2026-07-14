import { logger } from "../utils/logger";

// Seasonal items by month index (0 = January)
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

// Common substitute map
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

// Staple items shown when history is empty
const STAPLES = [
  "milk", "eggs", "bread", "butter", "bananas",
  "apples", "chicken", "rice", "pasta", "tomatoes",
];

/**
 * RecommendationService
 * Personalised, seasonal, and substitute suggestions.
 * Full history-based logic is wired up in Milestone 9.
 */
export class RecommendationService {
  /**
   * Personalised recommendations based on purchase history.
   * Falls back to staple suggestions until M9 history data is available.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPersonalised(_userId: string) {
    try {
      // TODO: query PurchaseHistory model in M9 and rank by frequency
      return STAPLES.map((name, i) => ({
        id: `staple-${i}`,
        itemName: name,
        category: "other",
        reason: "Frequently purchased staple",
        source: "history",
        confidence: 0.9 - i * 0.05,
      }));
    } catch (error) {
      logger.error("getPersonalised error:", error);
      return [];
    }
  }

  /**
   * Seasonal suggestions based on the current calendar month.
   */
  async getSeasonal() {
    try {
      const month = new Date().getMonth();
      const items = SEASONAL_MONTHS[month] ?? [];
      return items.map((name, i) => ({
        id: `seasonal-${i}`,
        itemName: name,
        category: "produce",
        reason: "In season right now",
        source: "seasonal",
        confidence: 0.85,
      }));
    } catch (error) {
      logger.error("getSeasonal error:", error);
      return [];
    }
  }

  /**
   * Returns substitute options for a given item name.
   */
  async getSubstitutes(itemName: string) {
    try {
      const key = itemName.toLowerCase().trim();
      const subs = SUBSTITUTES[key] ?? [];
      return {
        item: itemName,
        substitutes: subs.map((name, i) => ({
          id: `sub-${i}`,
          itemName: name,
          category: "other",
          reason: `Alternative to ${itemName}`,
          source: "substitute",
          confidence: 0.8 - i * 0.05,
        })),
      };
    } catch (error) {
      logger.error("getSubstitutes error:", error);
      return { item: itemName, substitutes: [] };
    }
  }
}
