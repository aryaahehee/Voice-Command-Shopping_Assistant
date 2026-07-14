"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useShopping } from "@/hooks/useShopping";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RecentItems() {
  const { activeList, isLoading } = useShopping();

  const recent = activeList?.items
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5) ?? [];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Recent Items</h3>
        </div>
        <Link
          href="/list"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : recent.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">No items yet</p>
            <Link
              href="/list"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Add your first item →
            </Link>
          </div>
        ) : (
          recent.map((item, i) => {
            const cat = ITEM_CATEGORIES.find((c) => c.value === item.category);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg py-1.5 px-2 hover:bg-muted/50 transition-colors"
              >
                {item.checked ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}

                <span
                  className={cn(
                    "flex-1 text-sm truncate",
                    item.checked && "line-through text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit}
                  </span>
                  <Badge variant="secondary" className="text-xs py-0 px-1.5">
                    {cat?.emoji}
                  </Badge>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
