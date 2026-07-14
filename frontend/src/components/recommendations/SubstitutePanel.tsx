"use client";

import { useState } from "react";
import { RefreshCw, Search, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useShopping } from "@/hooks/useShopping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types";

/**
 * SubstitutePanel — lets the user search for substitutes of any item.
 * Results show in an animated list with one-tap add to list.
 */
export function SubstitutePanel() {
  const { getSubstitutes } = useRecommendations();
  const { addItem } = useShopping();

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{
    item: string;
    substitutes: Recommendation[];
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await getSubstitutes(query.trim());
      setResult(data);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async (name: string) => {
    await addItem({ name, quantity: 1, unit: "pcs", addedVoice: false });
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-amber-500" />
        <h3 className="font-semibold text-sm">Find Substitutes</h3>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="e.g. milk, butter, eggs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
            aria-label="Search for item substitutes"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isSearching || !query.trim()}
          className="h-9"
        >
          {isSearching ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.item}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {/* Original item */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground capitalize">
                {result.item}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
              <span>alternatives</span>
            </div>

            {result.substitutes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No substitutes found for &ldquo;{result.item}&rdquo;
              </p>
            ) : (
              <div className="space-y-1.5">
                {result.substitutes.map((sub, i) => (
                  <motion.div
                    key={sub.id ?? i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group flex items-center justify-between rounded-lg border bg-card/60 px-3 py-2.5 hover:bg-card transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium capitalize truncate">
                        {sub.itemName}
                      </span>
                      {/* Confidence badge */}
                      <Badge
                        variant="secondary"
                        className="text-xs py-0 shrink-0"
                      >
                        {Math.round(sub.confidence * 100)}%
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                      onClick={() => handleAdd(sub.itemName)}
                    >
                      Add
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
