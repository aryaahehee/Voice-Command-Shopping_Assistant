/**
 * Application-wide constants for VoiceCart.
 */

export const APP_NAME = "VoiceCart";
export const APP_DESCRIPTION = "AI-powered Voice Command Shopping Assistant";
export const APP_VERSION = "0.1.0";

// API
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const API_TIMEOUT_MS = 15_000;

// Auth
export const ACCESS_TOKEN_KEY = "vc_access_token";
export const REFRESH_TOKEN_KEY = "vc_refresh_token";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;

// Voice
export const VOICE_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "hi-IN", label: "Hindi" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ar-SA", label: "Arabic" },
] as const;

export type VoiceLanguageCode = (typeof VOICE_LANGUAGES)[number]["code"];

export const DEFAULT_VOICE_LANGUAGE: VoiceLanguageCode = "en-US";

// Item categories
export const ITEM_CATEGORIES = [
  { value: "dairy", label: "Dairy", emoji: "🥛" },
  { value: "produce", label: "Produce", emoji: "🥦" },
  { value: "bakery", label: "Bakery", emoji: "🍞" },
  { value: "meat", label: "Meat", emoji: "🥩" },
  { value: "seafood", label: "Seafood", emoji: "🐟" },
  { value: "frozen", label: "Frozen", emoji: "🧊" },
  { value: "beverages", label: "Beverages", emoji: "🧃" },
  { value: "snacks", label: "Snacks", emoji: "🍿" },
  { value: "household", label: "Household", emoji: "🧹" },
  { value: "personal_care", label: "Personal Care", emoji: "🧴" },
  { value: "other", label: "Other", emoji: "📦" },
] as const;

// Item units
export const ITEM_UNITS = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "lb", label: "Pounds" },
  { value: "oz", label: "Ounces" },
  { value: "l", label: "Litres" },
  { value: "ml", label: "Millilitres" },
  { value: "dozen", label: "Dozen" },
  { value: "pack", label: "Pack" },
  { value: "bottle", label: "Bottle" },
  { value: "can", label: "Can" },
  { value: "box", label: "Box" },
  { value: "bag", label: "Bag" },
] as const;

// Seasonal months mapping
export const SEASONAL_MONTHS: Record<number, string[]> = {
  0: ["oranges", "grapefruit", "kale", "sweet potatoes"],   // January
  1: ["blood oranges", "leeks", "Brussels sprouts"],          // February
  2: ["asparagus", "strawberries", "artichokes"],             // March
  3: ["peas", "radishes", "spinach", "rhubarb"],              // April
  4: ["cherries", "peas", "lettuce", "zucchini"],             // May
  5: ["blueberries", "peaches", "corn", "tomatoes"],          // June
  6: ["watermelon", "raspberries", "eggplant", "peppers"],    // July
  7: ["figs", "blackberries", "plums", "corn"],               // August
  8: ["apples", "grapes", "pumpkin", "butternut squash"],     // September
  9: ["pears", "cranberries", "sweet potatoes", "parsnips"],  // October
  10: ["pomegranate", "turnips", "cauliflower"],               // November
  11: ["clementines", "pomelo", "chestnuts"],                  // December
};

// Substitution map
export const SUBSTITUTES: Record<string, string[]> = {
  milk: ["almond milk", "oat milk", "soy milk", "coconut milk"],
  butter: ["margarine", "coconut oil", "olive oil", "ghee"],
  eggs: ["flax eggs", "chia eggs", "applesauce", "silken tofu"],
  flour: ["almond flour", "oat flour", "coconut flour", "rice flour"],
  sugar: ["honey", "maple syrup", "agave nectar", "stevia"],
  cream: ["coconut cream", "cashew cream", "Greek yogurt"],
  cheese: ["nutritional yeast", "tofu cheese", "vegan cheese"],
  beef: ["turkey", "chicken", "lentils", "mushrooms"],
};
