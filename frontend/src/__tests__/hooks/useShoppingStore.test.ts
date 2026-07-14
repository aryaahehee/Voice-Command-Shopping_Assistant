import { renderHook, act } from "@testing-library/react";
import { useShoppingStore } from "@/store/useShoppingStore";
import type { ShoppingItem, ShoppingList } from "@/types";

const MOCK_ITEM: ShoppingItem = {
  _id: "item-1",
  name: "Apples",
  quantity: 3,
  unit: "kg",
  category: "produce",
  checked: false,
  addedVoice: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_LIST: ShoppingList = {
  _id: "list-1",
  userId: "user-1",
  name: "Weekly Shop",
  items: [MOCK_ITEM],
  isActive: true,
  totalItems: 1,
  checkedItems: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("useShoppingStore", () => {
  beforeEach(() => {
    // Reset store state between tests
    useShoppingStore.setState({
      lists: [],
      activeList: null,
      isLoading: false,
      error: null,
      filters: {},
    });
  });

  it("sets lists", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setLists([MOCK_LIST]));
    expect(result.current.lists).toHaveLength(1);
    expect(result.current.lists[0].name).toBe("Weekly Shop");
  });

  it("sets active list", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setActiveList(MOCK_LIST));
    expect(result.current.activeList?._id).toBe("list-1");
  });

  it("adds item to active list", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setActiveList(MOCK_LIST));

    const newItem: ShoppingItem = { ...MOCK_ITEM, _id: "item-2", name: "Milk" };
    act(() => result.current.addItemToActiveList(newItem));

    expect(result.current.activeList?.items).toHaveLength(2);
    expect(result.current.activeList?.totalItems).toBe(2);
  });

  it("removes item from active list", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setActiveList(MOCK_LIST));
    act(() => result.current.removeItemFromActiveList("item-1"));

    expect(result.current.activeList?.items).toHaveLength(0);
    expect(result.current.activeList?.totalItems).toBe(0);
  });

  it("toggles item checked state", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setActiveList(MOCK_LIST));

    act(() => result.current.toggleItemChecked("item-1"));
    expect(result.current.activeList?.items[0].checked).toBe(true);
    expect(result.current.activeList?.checkedItems).toBe(1);

    act(() => result.current.toggleItemChecked("item-1"));
    expect(result.current.activeList?.items[0].checked).toBe(false);
    expect(result.current.activeList?.checkedItems).toBe(0);
  });

  it("updates item in active list", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setActiveList(MOCK_LIST));
    act(() =>
      result.current.updateItemInActiveList("item-1", { quantity: 5 })
    );
    expect(result.current.activeList?.items[0].quantity).toBe(5);
  });

  it("sets and clears filters", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setFilters({ query: "milk", category: "dairy" }));
    expect(result.current.filters.query).toBe("milk");
    expect(result.current.filters.category).toBe("dairy");

    act(() => result.current.clearFilters());
    expect(result.current.filters).toEqual({});
  });

  it("sets loading state", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setLoading(true));
    expect(result.current.isLoading).toBe(true);
    act(() => result.current.setLoading(false));
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error state", () => {
    const { result } = renderHook(() => useShoppingStore());
    act(() => result.current.setError("Network error"));
    expect(result.current.error).toBe("Network error");
    act(() => result.current.setError(null));
    expect(result.current.error).toBeNull();
  });
});
