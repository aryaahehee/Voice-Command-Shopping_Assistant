"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useShopping } from "@/hooks/useShopping";
import { ItemCard, ItemCardSkeleton } from "./ItemCard";
import { AddItemForm } from "./AddItemForm";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ITEM_CATEGORIES } from "@/lib/constants";
import type { ShoppingItem, CreateShoppingItemInput } from "@/types";

export function ShoppingListView() {
  const {
    activeList,
    filteredItems,
    isLoading,
    filters,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    setFilters,
    clearFilters,
  } = useShopping();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShoppingItem | null>(null);

  const checkedCount = activeList?.items.filter((i) => i.checked).length ?? 0;
  const totalCount = activeList?.items.length ?? 0;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const handleAdd = async (item: CreateShoppingItemInput) => {
    await addItem(item);
  };

  const handleEdit = async (item: CreateShoppingItemInput) => {
    if (!editItem) return;
    await updateItem(editItem._id, item);
    setEditItem(null);
  };

  // Group filtered items by category
  const grouped = ITEM_CATEGORIES.map((cat) => ({
    ...cat,
    items: filteredItems.filter((i) => i.category === cat.value),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {activeList?.name ?? "Shopping List"}
          </h2>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {checkedCount} of {totalCount} items done
            </p>
          )}
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          {progress === 100 && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> All done — great shopping!
            </p>
          )}
        </div>
      )}

      {/* Search + filters */}
      <SearchBar
        filters={filters}
        onFiltersChange={setFilters}
        onClear={clearFilters}
        resultCount={filteredItems.length}
      />

      <Separator />

      {/* Item list */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState hasFilters={!!filters.query || !!filters.category} />
        ) : (
          <div className="space-y-4 pb-4">
            <AnimatePresence mode="popLayout">
              {grouped.map((group) => (
                <motion.div
                  key={group.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-base">{group.emoji}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {group.label}
                    </span>
                    <Badge variant="secondary" className="text-xs py-0 ml-auto">
                      {group.items.length}
                    </Badge>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {group.items.map((item) => (
                        <ItemCard
                          key={item._id}
                          item={item}
                          onToggle={toggleItem}
                          onDelete={deleteItem}
                          onEdit={setEditItem}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {/* Add item dialog */}
      <AddItemForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />

      {/* Edit item dialog */}
      <AddItemForm
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        onSubmit={handleEdit}
        initialValues={editItem ?? undefined}
      />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{hasFilters ? "🔍" : "🛒"}</div>
      <p className="font-medium text-muted-foreground">
        {hasFilters ? "No items match your search" : "Your list is empty"}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {hasFilters
          ? "Try adjusting your filters"
          : "Add your first item or use the microphone"}
      </p>
    </div>
  );
}
