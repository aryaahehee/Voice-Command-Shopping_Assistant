"use client";

import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useShopping } from "@/hooks/useShopping";
import { RecommendationCard, RecommendationCardSkeleton } from "./RecommendationCard";
import { Badge } from "@/components/ui/badge";

/**
 * SeasonalSuggestions — shows produce and items in season this month.
 */
export function SeasonalSuggestions() {
  const { seasonal, isLoading } = useRecommendations();
  const { addItem } = useShopping();

  const handleAdd = async (name: string) => {
    await addItem({ name, quantity: 1, unit: "pcs", addedVoice: false });
  };

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-500" />
          <h3 className="font-semibold text-sm">In Season</h3>
          <Badge variant="secondary" className="text-xs py-0">{monthName}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {seasonal.length} items
        </span>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))
        ) : seasonal.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No seasonal data available
          </p>
        ) : (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {seasonal.map((rec, i) => (
              <RecommendationCard
                key={rec.id ?? i}
                recommendation={rec}
                onAdd={handleAdd}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
