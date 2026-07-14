"use client";

import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useShopping } from "@/hooks/useShopping";
import { RecommendationCard, RecommendationCardSkeleton } from "./RecommendationCard";
import { Button } from "@/components/ui/button";

/**
 * PersonalisedRecommendations — top picks based on purchase history.
 * Shows staple items for new users.
 */
export function PersonalisedRecommendations() {
  const { personalised, isLoading, refetch } = useRecommendations();
  const { addItem } = useShopping();

  const handleAdd = async (name: string) => {
    await addItem({ name, quantity: 1, unit: "pcs", addedVoice: false });
  };

  // Show at most 8 cards
  const items = personalised.slice(0, 8);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <h3 className="font-semibold text-sm">For You</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={refetch}
          disabled={isLoading}
          aria-label="Refresh recommendations"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Shop a few times and we&apos;ll personalise your recommendations.
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {items.map((rec, i) => (
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
