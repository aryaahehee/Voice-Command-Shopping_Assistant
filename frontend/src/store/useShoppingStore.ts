import { create } from "zustand";
import type { ShoppingItem, ShoppingList, SearchFilters } from "@/types";

interface ShoppingState {
  lists: ShoppingList[];
  activeList: ShoppingList | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
}

interface ShoppingActions {
  setLists: (lists: ShoppingList[]) => void;
  setActiveList: (list: ShoppingList | null) => void;
  addItemToActiveList: (item: ShoppingItem) => void;
  updateItemInActiveList: (id: string, updates: Partial<ShoppingItem>) => void;
  removeItemFromActiveList: (id: string) => void;
  toggleItemChecked: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
}

type ShoppingStore = ShoppingState & ShoppingActions;

/**
 * Global shopping list state managed by Zustand.
 * Not persisted — data comes from the backend on each session.
 */
export const useShoppingStore = create<ShoppingStore>()((set) => ({
  // State
  lists: [],
  activeList: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  setLists: (lists) => set({ lists }),
  setActiveList: (activeList) => set({ activeList }),

  addItemToActiveList: (item) =>
    set((state) => {
      if (!state.activeList) return state;
      return {
        activeList: {
          ...state.activeList,
          items: [...state.activeList.items, item],
          totalItems: state.activeList.totalItems + 1,
        },
      };
    }),

  updateItemInActiveList: (id, updates) =>
    set((state) => {
      if (!state.activeList) return state;
      return {
        activeList: {
          ...state.activeList,
          items: state.activeList.items.map((item) =>
            item._id === id ? { ...item, ...updates } : item
          ),
        },
      };
    }),

  removeItemFromActiveList: (id) =>
    set((state) => {
      if (!state.activeList) return state;
      const filtered = state.activeList.items.filter((i) => i._id !== id);
      return {
        activeList: {
          ...state.activeList,
          items: filtered,
          totalItems: filtered.length,
        },
      };
    }),

  toggleItemChecked: (id) =>
    set((state) => {
      if (!state.activeList) return state;
      const items = state.activeList.items.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      );
      const checkedItems = items.filter((i) => i.checked).length;
      return {
        activeList: {
          ...state.activeList,
          items,
          checkedItems,
        },
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  clearFilters: () => set({ filters: {} }),
}));
