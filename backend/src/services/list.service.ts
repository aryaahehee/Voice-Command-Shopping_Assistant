import mongoose from "mongoose";
import { ShoppingList, PurchaseHistory, detectCategory } from "../models/index";
import type { IShoppingList, IShoppingItem } from "../models/index";
import { ItemUnit, ItemCategory } from "../types";

export interface AddItemInput {
  name: string;
  quantity?: number;
  unit?: ItemUnit;
  category?: ItemCategory;
  notes?: string;
  price?: number;
  brand?: string;
  addedVoice?: boolean;
}

/**
 * ListService — full CRUD for shopping lists and their items.
 * Records purchases to PurchaseHistory on item check-off.
 */
export class ListService {
  // ── Lists ────────────────────────────────────────────────

  async getListsByUser(userId: string): Promise<IShoppingList[]> {
    return ShoppingList.find({ userId })
      .sort({ isActive: -1, updatedAt: -1 })
      .lean({ virtuals: true });
  }

  async createList(userId: string, name: string): Promise<IShoppingList> {
    return ShoppingList.create({ userId, name });
  }

  async getListById(
    id: string,
    userId: string
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ShoppingList.findOne({ _id: id, userId }).lean({ virtuals: true });
  }

  async updateList(
    id: string,
    userId: string,
    updates: { name?: string; isActive?: boolean }
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ShoppingList.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });
  }

  async deleteList(id: string, userId: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(id)) return false;
    const result = await ShoppingList.deleteOne({ _id: id, userId });
    return result.deletedCount === 1;
  }

  // ── Items ────────────────────────────────────────────────

  async addItem(
    listId: string,
    userId: string,
    itemData: AddItemInput
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(listId)) return null;

    // Auto-detect category if not provided
    const category: ItemCategory =
      itemData.category ?? detectCategory(itemData.name);

    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      name: itemData.name,
      quantity: itemData.quantity ?? 1,
      unit: itemData.unit ?? "pcs",
      category,
      notes: itemData.notes,
      price: itemData.price,
      brand: itemData.brand,
      addedVoice: itemData.addedVoice ?? false,
      checked: false,
    };

    return ShoppingList.findOneAndUpdate(
      { _id: listId, userId },
      { $push: { items: newItem } },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });
  }

  async updateItem(
    listId: string,
    itemId: string,
    userId: string,
    updates: Partial<AddItemInput & { checked: boolean }>
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(listId) || !mongoose.isValidObjectId(itemId))
      return null;

    // Build positional update object
    const setFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setFields[`items.$.${key}`] = value;
      }
    }

    return ShoppingList.findOneAndUpdate(
      { _id: listId, userId, "items._id": new mongoose.Types.ObjectId(itemId) },
      { $set: setFields },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });
  }

  async removeItem(
    listId: string,
    itemId: string,
    userId: string
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(listId) || !mongoose.isValidObjectId(itemId))
      return null;

    return ShoppingList.findOneAndUpdate(
      { _id: listId, userId },
      {
        $pull: {
          items: { _id: new mongoose.Types.ObjectId(itemId) },
        },
      },
      { new: true }
    ).lean({ virtuals: true });
  }

  async toggleItem(
    listId: string,
    itemId: string,
    userId: string
  ): Promise<IShoppingList | null> {
    if (!mongoose.isValidObjectId(listId) || !mongoose.isValidObjectId(itemId))
      return null;

    // First, fetch the current checked state of the item
    const list = await ShoppingList.findOne({
      _id: listId,
      userId,
      "items._id": new mongoose.Types.ObjectId(itemId),
    });

    if (!list) return null;

    const item = list.items.id(itemId) as (IShoppingItem & { _id: mongoose.Types.ObjectId }) | null;
    if (!item) return null;

    const newChecked = !item.checked;

    const updated = await ShoppingList.findOneAndUpdate(
      { _id: listId, userId, "items._id": new mongoose.Types.ObjectId(itemId) },
      { $set: { "items.$.checked": newChecked } },
      { new: true }
    ).lean({ virtuals: true });

    // Record to purchase history when an item is checked off
    if (newChecked && updated) {
      await PurchaseHistory.create({
        userId,
        itemName: item.name,
        normalizedName: item.name.toLowerCase().trim(),
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        price: item.price,
        brand: item.brand,
        addedVoice: item.addedVoice,
        purchasedAt: new Date(),
      });
    }

    return updated;
  }
}
