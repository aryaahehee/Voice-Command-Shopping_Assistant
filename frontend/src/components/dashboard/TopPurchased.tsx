"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";

export function TopPurchased() {
  const { stats, isLoading } = useStats();
  const items = stats?.mostPurchasedItems.slice(0, 6) ?? [];
  const maxCount = items[0]?.count ?? 1;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-violet-500" />
        <h3 className="font-semibold text-sm">Most Purchased</h3>
      </div>

      <div className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Purchase history will appear here
          </p>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium capitalize truncate">{item.name}</span>
                <span className="text-muted-foreground shrink-0 ml-2">
                  ×{item.count}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / maxCount) * 100}%` }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.5 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
