import mongoose, { Schema, Document, Model } from "mongoose";
import { ItemCategory, ItemUnit } from "../types";

// ── ShoppingItem sub-document ───────────────────────────────
export interface IShoppingItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unit: ItemUnit;
  category: ItemCategory;
  notes?: string;
  checked: boolean;
  price?: number;
  brand?: string;
  imageUrl?: string;
  addedVoice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── ShoppingList document ────────────────────────────────────
export interface IShoppingList extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  items: mongoose.Types.DocumentArray<IShoppingItem & Document>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  totalItems: number;
  checkedItems: number;
  estimatedTotal: number;
}

export interface IShoppingListModel extends Model<IShoppingList> {
  findActiveByUser(userId: string): Promise<IShoppingList | null>;
}

// ── Item sub-schema ──────────────────────────────────────────
const ITEM_CATEGORIES: ItemCategory[] = [
  "dairy", "produce", "bakery", "meat", "seafood",
  "frozen", "beverages", "snacks", "household", "personal_care", "other",
];

const ITEM_UNITS: ItemUnit[] = [
  "pcs", "kg", "g", "lb", "oz", "l", "ml",
  "dozen", "pack", "bottle", "can", "box", "bag",
];

const shoppingItemSchema = new Schema<IShoppingItem>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [0.01, "Quantity must be greater than 0"],
    },
    unit: {
      type: String,
      enum: ITEM_UNITS,
      default: "pcs",
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      default: "other",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
    checked: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    imageUrl: {
      type: String,
    },
    addedVoice: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ── Main list schema ─────────────────────────────────────────
const shoppingListSchema = new Schema<IShoppingList, IShoppingListModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
      maxlength: [100, "List name cannot exceed 100 characters"],
      default: "My Shopping List",
    },
    items: {
      type: [shoppingItemSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────
shoppingListSchema.index({ userId: 1, isActive: 1 });
shoppingListSchema.index({ userId: 1, createdAt: -1 });

// ── Virtuals ─────────────────────────────────────────────────
shoppingListSchema.virtual("totalItems").get(function () {
  return this.items.length;
});

shoppingListSchema.virtual("checkedItems").get(function () {
  return this.items.filter((i) => i.checked).length;
});

shoppingListSchema.virtual("estimatedTotal").get(function () {
  return this.items.reduce((sum, item) => {
    return sum + (item.price ?? 0) * item.quantity;
  }, 0);
});

// ── Static: get the current active list for a user ───────────
shoppingListSchema.statics.findActiveByUser = function (userId: string) {
  return this.findOne({ userId, isActive: true }).sort({ createdAt: -1 });
};

// ── Auto-categorise items by name keyword ───────────────────
const CATEGORY_KEYWORDS: Record<ItemCategory, string[]> = {
  dairy:        ["milk", "cheese", "yogurt", "cream", "butter", "curd", "ghee"],
  produce:      ["apple", "banana", "carrot", "tomato", "lettuce", "spinach", "pepper", "onion", "garlic", "potato", "orange", "grape", "strawberry", "mango"],
  bakery:       ["bread", "bun", "cake", "muffin", "bagel", "croissant", "roll", "loaf", "pastry"],
  meat:         ["chicken", "beef", "pork", "lamb", "turkey", "sausage", "bacon", "steak", "mince"],
  seafood:      ["fish", "salmon", "tuna", "shrimp", "prawn", "crab", "lobster", "cod", "tilapia"],
  frozen:       ["frozen", "ice cream", "gelato", "sorbet"],
  beverages:    ["juice", "water", "soda", "cola", "tea", "coffee", "beer", "wine", "smoothie", "drink"],
  snacks:       ["chips", "popcorn", "nuts", "crackers", "biscuits", "chocolate", "candy", "granola"],
  household:    ["soap", "detergent", "cleaner", "tissue", "toilet", "paper towel", "bin bag", "sponge", "bleach"],
  personal_care:["shampoo", "conditioner", "toothpaste", "toothbrush", "deodorant", "lotion", "razor", "moisturiser"],
  other:        [],
};

/**
 * Auto-detect category from item name using keyword matching.
 * Falls back to "other" if no match found.
 */
export function detectCategory(itemName: string): ItemCategory {
  const lower = itemName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as ItemCategory;
    }
  }
  return "other";
}

export const ShoppingList = mongoose.model<IShoppingList, IShoppingListModel>(
  "ShoppingList",
  shoppingListSchema
);
