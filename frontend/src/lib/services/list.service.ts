import api from "@/lib/api";
import type {
  ApiResponse,
  ShoppingList,
  ShoppingItem,
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
} from "@/types";

/**
 * Frontend shopping list API service.
 * All calls go to /api/lists/* on the Express backend.
 */
export const listService = {
  // ── Lists ──────────────────────────────────────────────────

  async getLists(): Promise<ShoppingList[]> {
    const { data } = await api.get<ApiResponse<ShoppingList[]>>("/lists");
    return data.data ?? [];
  },

  async createList(name: string): Promise<ShoppingList> {
    const { data } = await api.post<ApiResponse<ShoppingList>>("/lists", {
      name,
    });
    if (!data.data) throw new Error(data.error ?? "Failed to create list");
    return data.data;
  },

  async getList(id: string): Promise<ShoppingList> {
    const { data } = await api.get<ApiResponse<ShoppingList>>(`/lists/${id}`);
    if (!data.data) throw new Error(data.error ?? "List not found");
    return data.data;
  },

  async updateList(
    id: string,
    updates: { name?: string; isActive?: boolean }
  ): Promise<ShoppingList> {
    const { data } = await api.patch<ApiResponse<ShoppingList>>(
      `/lists/${id}`,
      updates
    );
    if (!data.data) throw new Error(data.error ?? "Failed to update list");
    return data.data;
  },

  async deleteList(id: string): Promise<void> {
    await api.delete(`/lists/${id}`);
  },

  // ── Items ──────────────────────────────────────────────────

  async addItem(
    listId: string,
    item: CreateShoppingItemInput
  ): Promise<ShoppingList> {
    const { data } = await api.post<ApiResponse<ShoppingList>>(
      `/lists/${listId}/items`,
      item
    );
    if (!data.data) throw new Error(data.error ?? "Failed to add item");
    return data.data;
  },

  async updateItem(
    listId: string,
    itemId: string,
    updates: UpdateShoppingItemInput
  ): Promise<ShoppingList> {
    const { data } = await api.patch<ApiResponse<ShoppingList>>(
      `/lists/${listId}/items/${itemId}`,
      updates
    );
    if (!data.data) throw new Error(data.error ?? "Failed to update item");
    return data.data;
  },

  async deleteItem(listId: string, itemId: string): Promise<ShoppingList> {
    const { data } = await api.delete<ApiResponse<ShoppingList>>(
      `/lists/${listId}/items/${itemId}`
    );
    if (!data.data) throw new Error(data.error ?? "Failed to delete item");
    return data.data;
  },

  async toggleItem(listId: string, itemId: string): Promise<ShoppingList> {
    const { data } = await api.patch<ApiResponse<ShoppingList>>(
      `/lists/${listId}/items/${itemId}/toggle`
    );
    if (!data.data) throw new Error(data.error ?? "Failed to toggle item");
    return data.data;
  },
};

// Re-export ShoppingItem type for use in components
export type { ShoppingItem };
