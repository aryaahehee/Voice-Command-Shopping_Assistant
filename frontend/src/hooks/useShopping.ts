"use client";

import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useShoppingStore } from "@/store/useShoppingStore";
import { listService } from "@/lib/services/list.service";
import { getErrorMessage } from "@/lib/api";
import type {
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
} from "@/types";

/**
 * useShopping — primary hook for all shopping list operations.
 * Keeps the Zustand store in sync with the backend.
 */
export function useShopping(listId?: string) {
  const {
    lists,
    activeList,
    isLoading,
    error,
    filters,
    setLists,
    setActiveList,
    setLoading,
    setError,
    setFilters,
    clearFilters,
  } = useShoppingStore();

  // ── Load all lists on mount ──────────────────────────────
  const fetchLists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listService.getLists();
      setLists(data);
      // Auto-select the first active list
      const active = data.find((l) => l.isActive) ?? data[0] ?? null;
      setActiveList(active);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setLists, setActiveList, setLoading, setError]);

  // ── Load a specific list ─────────────────────────────────
  const fetchList = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const data = await listService.getList(id);
        setActiveList(data);
      } catch (err) {
        setError(getErrorMessage(err));
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [setActiveList, setLoading, setError]
  );

  useEffect(() => {
    if (listId) {
      fetchList(listId);
    } else {
      fetchLists();
    }
  }, [listId, fetchList, fetchLists]);

  // ── Create list ──────────────────────────────────────────
  const createList = useCallback(
    async (name: string) => {
      try {
        const list = await listService.createList(name);
        setLists([...lists, list]);
        setActiveList(list);
        toast.success(`"${name}" created`);
        return list;
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [lists, setLists, setActiveList]
  );

  // ── Add item ─────────────────────────────────────────────
  const addItem = useCallback(
    async (item: CreateShoppingItemInput) => {
      if (!activeList) {
        toast.error("No active list selected");
        return;
      }
      try {
        const updated = await listService.addItem(activeList._id, item);
        setActiveList(updated);
        toast.success(`"${item.name}" added`);
        return updated;
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [activeList, setActiveList]
  );

  // ── Update item ──────────────────────────────────────────
  const updateItem = useCallback(
    async (itemId: string, updates: UpdateShoppingItemInput) => {
      if (!activeList) return;
      try {
        const updated = await listService.updateItem(
          activeList._id,
          itemId,
          updates
        );
        setActiveList(updated);
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [activeList, setActiveList]
  );

  // ── Delete item ──────────────────────────────────────────
  const deleteItem = useCallback(
    async (itemId: string, itemName: string) => {
      if (!activeList) return;
      try {
        const updated = await listService.deleteItem(activeList._id, itemId);
        setActiveList(updated);
        toast.success(`"${itemName}" removed`);
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [activeList, setActiveList]
  );

  // ── Toggle checked ────────────────────────────────────────
  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!activeList) return;
      try {
        const updated = await listService.toggleItem(activeList._id, itemId);
        setActiveList(updated);
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [activeList, setActiveList]
  );

  // ── Filtered items ────────────────────────────────────────
  const filteredItems = activeList?.items.filter((item) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (
        !item.name.toLowerCase().includes(q) &&
        !item.brand?.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.category && item.category !== filters.category) return false;
    if (filters.checked !== undefined && item.checked !== filters.checked)
      return false;
    if (filters.maxPrice && item.price && item.price > filters.maxPrice)
      return false;
    return true;
  }) ?? [];

  return {
    lists,
    activeList,
    filteredItems,
    isLoading,
    error,
    filters,
    fetchLists,
    fetchList,
    createList,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    setFilters,
    clearFilters,
  };
}
