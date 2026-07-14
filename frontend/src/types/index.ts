// =============================================================
// Global TypeScript types for VoiceCart
// =============================================================

// ─── User ─────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Shopping Item ────────────────────────────────────────────
export type ItemCategory =
  | "dairy"
  | "produce"
  | "bakery"
  | "meat"
  | "seafood"
  | "frozen"
  | "beverages"
  | "snacks"
  | "household"
  | "personal_care"
  | "other";

export type ItemUnit =
  | "pcs"
  | "kg"
  | "g"
  | "lb"
  | "oz"
  | "l"
  | "ml"
  | "dozen"
  | "pack"
  | "bottle"
  | "can"
  | "box"
  | "bag";

export interface ShoppingItem {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateShoppingItemInput {
  name: string;
  quantity?: number;
  unit?: ItemUnit;
  category?: ItemCategory;
  notes?: string;
  price?: number;
  brand?: string;
  addedVoice?: boolean;
}

export interface UpdateShoppingItemInput extends Partial<CreateShoppingItemInput> {
  checked?: boolean;
}

// ─── Shopping List ────────────────────────────────────────────
export interface ShoppingList {
  _id: string;
  userId: string;
  name: string;
  items: ShoppingItem[];
  isActive: boolean;
  totalItems: number;
  checkedItems: number;
  estimatedTotal?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Voice ────────────────────────────────────────────────────
export type VoiceCommandAction =
  | "add"
  | "remove"
  | "update_quantity"
  | "check"
  | "uncheck"
  | "search"
  | "clear"
  | "unknown";

export interface ParsedVoiceCommand {
  action: VoiceCommandAction;
  itemName?: string;
  quantity?: number;
  unit?: ItemUnit;
  maxPrice?: number;
  brand?: string;
  rawTranscript: string;
  confidence: number;
  language?: string;
}

export type VoiceState = "idle" | "listening" | "processing" | "error";

// ─── Recommendations ─────────────────────────────────────────
export type RecommendationSource =
  | "history"
  | "seasonal"
  | "substitute"
  | "trending";

export interface Recommendation {
  _id: string;
  itemName: string;
  category: ItemCategory;
  reason: string;
  source: RecommendationSource;
  confidence: number;
  imageUrl?: string;
  alternatives?: string[];
}

// ─── Purchase History ─────────────────────────────────────────
export interface PurchaseRecord {
  _id: string;
  userId: string;
  itemName: string;
  quantity: number;
  unit: ItemUnit;
  category: ItemCategory;
  price?: number;
  purchasedAt: string;
}

// ─── Statistics ───────────────────────────────────────────────
export interface ShoppingStats {
  totalItemsAdded: number;
  totalItemsChecked: number;
  voiceCommandsUsed: number;
  mostPurchasedItems: Array<{ name: string; count: number }>;
  categoryBreakdown: Array<{ category: ItemCategory; count: number }>;
  weeklyActivity: Array<{ day: string; items: number }>;
  totalSpent?: number;
}

// ─── API Response ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─── Search / Filter ──────────────────────────────────────────
export interface SearchFilters {
  query?: string;
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  checked?: boolean;
}

// ─── Theme ────────────────────────────────────────────────────
export type Theme = "light" | "dark" | "system";
