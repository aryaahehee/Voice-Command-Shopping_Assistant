"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ITEM_CATEGORIES } from "@/lib/constants";
import type { SearchFilters } from "@/types";

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (f: Partial<SearchFilters>) => void;
  onClear: () => void;
  resultCount?: number;
}

export function SearchBar({
  filters,
  onFiltersChange,
  onClear,
  resultCount,
}: SearchBarProps) {
  const hasFilters =
    !!filters.query || !!filters.category || filters.checked !== undefined;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Text search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search items…"
            value={filters.query ?? ""}
            onChange={(e) => onFiltersChange({ query: e.target.value || undefined })}
            className="pl-9"
            aria-label="Search shopping list"
          />
          {filters.query && (
            <button
              onClick={() => onFiltersChange({ query: undefined })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <Select
          value={filters.category ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({ category: v === "all" ? undefined : (v as SearchFilters["category"]) })
          }
        >
          <SelectTrigger className="w-36" aria-label="Filter by category">
            <SlidersHorizontal className="h-4 w-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {ITEM_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear all filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Result count + active filter chips */}
      {(hasFilters || resultCount !== undefined) && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          {resultCount !== undefined && (
            <span>{resultCount} item{resultCount !== 1 ? "s" : ""}</span>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1 py-0">
              {ITEM_CATEGORIES.find((c) => c.value === filters.category)?.emoji}{" "}
              {ITEM_CATEGORIES.find((c) => c.value === filters.category)?.label}
              <button onClick={() => onFiltersChange({ category: undefined })} aria-label="Remove category filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.checked !== undefined && (
            <Badge variant="secondary" className="gap-1 py-0">
              {filters.checked ? "Checked" : "Unchecked"}
              <button onClick={() => onFiltersChange({ checked: undefined })} aria-label="Remove checked filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
