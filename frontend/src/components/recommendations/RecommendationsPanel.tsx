"use client";

import { useState } from "react";
import { Sparkles, Leaf, RefreshCw } from "lucide-react";
import { PersonalisedRecommendations } from "./PersonalisedRecommendations";
import { SeasonalSuggestions } from "./SeasonalSuggestions";
import { SubstitutePanel } from "./SubstitutePanel";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Tab = "personalised" | "seasonal" | "substitutes";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personalised", label: "For You",     icon: Sparkles },
  { id: "seasonal",     label: "Seasonal",    icon: Leaf },
  { id: "substitutes",  label: "Substitutes", icon: RefreshCw },
];

/**
 * RecommendationsPanel — tabbed panel combining all recommendation types.
 * Used on the dashboard sidebar and the dedicated recommendations section.
 */
export function RecommendationsPanel() {
  const [active, setActive] = useState<Tab>("personalised");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card/50 p-5 shadow-sm">
      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
              active === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-selected={active === id}
            role="tab"
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <Separator />

      {/* Panel content */}
      {active === "personalised" && <PersonalisedRecommendations />}
      {active === "seasonal"     && <SeasonalSuggestions />}
      {active === "substitutes"  && <SubstitutePanel />}
    </div>
  );
}
