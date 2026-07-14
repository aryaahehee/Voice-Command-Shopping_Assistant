import mongoose, { Schema, Document, Model } from "mongoose";
import { ItemCategory, ItemUnit } from "../types";

// ── Document interface ────────────────────────────────────────
export interface IPurchaseHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  itemName: string;
  normalizedName: string;   // lowercase, trimmed — used for frequency queries
  quantity: number;
  unit: ItemUnit;
  category: ItemCategory;
  price?: number;
  brand?: string;
  addedVoice: boolean;
  purchasedAt: Date;
  createdAt: Date;
}

export interface IPurchaseHistoryModel extends Model<IPurchaseHistory> {
  getFrequentItems(
    userId: string,
    limit?: number
  ): Promise<Array<{ itemName: string; count: number; category: ItemCategory }>>;
}

// ── Schema ───────────────────────────────────────────────────
const purchaseHistorySchema = new Schema<IPurchaseHistory, IPurchaseHistoryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    normalizedName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0.01,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    category: {
      type: String,
      default: "other",
    },
    price: {
      type: Number,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    addedVoice: {
      type: Boolean,
      default: false,
    },
    purchasedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────
purchaseHistorySchema.index({ userId: 1, normalizedName: 1 });
purchaseHistorySchema.index({ userId: 1, purchasedAt: -1 });
purchaseHistorySchema.index({ userId: 1, category: 1 });

// ── Pre-save: set normalizedName ─────────────────────────────
purchaseHistorySchema.pre("save", function (next) {
  this.normalizedName = this.itemName.toLowerCase().trim();
  next();
});

// ── Static: get top N most-purchased items for a user ────────
purchaseHistorySchema.statics.getFrequentItems = async function (
  userId: string,
  limit = 10
) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$normalizedName",
        itemName: { $first: "$itemName" },
        category: { $first: "$category" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        itemName: 1,
        category: 1,
        count: 1,
      },
    },
  ]);
};

export const PurchaseHistory = mongoose.model<
  IPurchaseHistory,
  IPurchaseHistoryModel
>("PurchaseHistory", purchaseHistorySchema);
