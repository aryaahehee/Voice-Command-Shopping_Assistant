"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Pencil,
  Check,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ITEM_CATEGORIES } from "@/lib/constants";
import type { ShoppingItem } from "@/types";

interface ItemCardProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onEdit: (item: ShoppingItem) => void;
}

export function ItemCard({ item, onToggle, onDelete, onEdit }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryMeta = ITEM_CATEGORIES.find((c) => c.value === item.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md",
        item.checked && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item._id)}
          aria-label={item.checked ? "Mark as unchecked" : "Mark as checked"}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
            item.checked
              ? "border-green-500 bg-green-500 text-white"
              : "border-muted-foreground/40 hover:border-primary"
          )}
        >
          {item.checked && <Check className="h-3 w-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "font-medium truncate",
                item.checked && "line-through text-muted-foreground"
              )}
            >
              {item.name}
            </p>

            {/* Quantity badge */}
            <span className="shrink-0 text-sm font-semibold text-primary">
              {item.quantity} {item.unit}
            </span>
          </div>

          {/* Category + brand */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="text-xs gap-1 py-0">
              <span>{categoryMeta?.emoji}</span>
              {categoryMeta?.label ?? item.category}
            </Badge>
            {item.brand && (
              <span className="text-xs text-muted-foreground">{item.brand}</span>
            )}
            {item.price !== undefined && (
              <span className="text-xs text-muted-foreground ml-auto">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            )}
            {item.addedVoice && (
              <Badge variant="outline" className="text-xs py-0 gap-1">
                🎤 Voice
              </Badge>
            )}
          </div>

          {/* Expandable notes */}
          <AnimatePresence>
            {item.notes && expanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-muted-foreground border-t pt-2"
              >
                {item.notes}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.notes && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse notes" : "Expand notes"}
            >
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(item)}
            aria-label="Edit item"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(item._id, item.name)}
            aria-label="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/** Skeleton version of ItemCard shown while loading */
export function ItemCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
        <div className="h-5 w-12 rounded bg-muted" />
      </div>
    </div>
  );
}
