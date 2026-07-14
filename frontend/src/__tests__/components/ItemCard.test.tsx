import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemCard } from "@/components/shopping/ItemCard";
import type { ShoppingItem } from "@/types";

const MOCK_ITEM: ShoppingItem = {
  _id: "item-001",
  name: "Whole Milk",
  quantity: 2,
  unit: "l",
  category: "dairy",
  checked: false,
  addedVoice: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const CHECKED_ITEM: ShoppingItem = {
  ...MOCK_ITEM,
  _id: "item-002",
  checked: true,
};

const VOICE_ITEM: ShoppingItem = {
  ...MOCK_ITEM,
  _id: "item-003",
  addedVoice: true,
  notes: "Get the organic version",
  price: 3.49,
};

describe("ItemCard", () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders item name", () => {
    render(
      <ItemCard
        item={MOCK_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(screen.getByText("Whole Milk")).toBeInTheDocument();
  });

  it("renders quantity and unit", () => {
    render(
      <ItemCard
        item={MOCK_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(screen.getByText("2 l")).toBeInTheDocument();
  });

  it("renders dairy category badge", () => {
    render(
      <ItemCard
        item={MOCK_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(screen.getByText(/dairy/i)).toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", () => {
    render(
      <ItemCard
        item={MOCK_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /mark as checked/i }));
    expect(onToggle).toHaveBeenCalledWith("item-001");
  });

  it("shows line-through when item is checked", () => {
    render(
      <ItemCard
        item={CHECKED_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    const nameEl = screen.getByText("Whole Milk");
    expect(nameEl).toHaveClass("line-through");
  });

  it("shows voice badge for voice-added items", () => {
    render(
      <ItemCard
        item={VOICE_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(screen.getByText(/voice/i)).toBeInTheDocument();
  });

  it("shows price when provided", () => {
    render(
      <ItemCard
        item={VOICE_ITEM}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    // price * quantity = 3.49 * 2 = 6.98
    expect(screen.getByText("$6.98")).toBeInTheDocument();
  });
});
