"use client";

import { motion } from "framer-motion";
import { Plus, TrendingUp, Leaf, RefreshCw, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ITEM_CATEGORIES } from "@/lib/constants";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAdd: (name: string) => void;
  index?: number;
}

const SOURCE_CONFIG = {
  history:   { icon: History,    label: "Past purchase",  color: "text-blue-500",   bg: "bg-blue-500/10" },
  seasonal:  { icon: Leaf,       label: "In season",      color: "text-green-500",  bg: "bg-green-500/10" },
  substitute:{ icon: RefreshCw,  label: "Substitute",     color: "text-amber-500",  bg: "bg-amber-500/10" },
  trending:  { icon: TrendingUp, label: "Trending",       color: "text-violet-500", bg: "bg-violet-500/10" },
};

export function RecommendationCard({
  recommendation,
  onAdd,
  index = 0,
}: RecommendationCardProps) {
  const src = SOURCE_CONFIG[recommendation.source] ?? SOURCE_CONFIG.history;
  const Icon = src.icon;
  const catMeta = ITEM_CATEGORIES.find((c) => c.value === recommendation.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group relative flex items-center gap-3 rounded-xl border bg-card p-3.5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Category emoji */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
        {catMeta?.emoji ?? "📦"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium capitalize truncate">{recommendation.itemName}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn("flex items-center gap-1 text-xs", src.color)}>
            <Icon className="h-3 w-3" />
            {src.label}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-xs text-muted-foreground truncate">
            {recommendation.reason}
          </span>
        </div>
      </div>

      {/* Confidence bar + add button */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onAdd(recommendation.itemName)}
          aria-label={`Add ${recommendation.itemName} to list`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {/* Confidence mini bar */}
        <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${recommendation.confidence * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Skeleton for loading state */
export function RecommendationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
