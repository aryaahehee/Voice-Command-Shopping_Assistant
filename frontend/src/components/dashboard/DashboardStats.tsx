"use client";

import { ShoppingCart, CheckCircle2, Mic, DollarSign } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useStats } from "@/hooks/useStats";
import { formatCurrency } from "@/lib/utils";

/**
 * DashboardStats — row of 4 animated stat cards.
 * Fetches live data from /api/stats.
 */
export function DashboardStats() {
  const { stats, isLoading } = useStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Items Added"
        value={stats?.totalItemsAdded ?? 0}
        subtitle="All time"
        icon={ShoppingCart}
        color="violet"
        isLoading={isLoading}
        index={0}
      />
      <StatsCard
        title="Items Checked"
        value={stats?.totalItemsChecked ?? 0}
        subtitle="Completed tasks"
        icon={CheckCircle2}
        color="green"
        isLoading={isLoading}
        index={1}
      />
      <StatsCard
        title="Voice Commands"
        value={stats?.voiceCommandsUsed ?? 0}
        subtitle="Items added by voice"
        icon={Mic}
        color="blue"
        isLoading={isLoading}
        index={2}
      />
      <StatsCard
        title="Total Spent"
        value={
          stats?.totalSpent
            ? formatCurrency(stats.totalSpent)
            : "$0.00"
        }
        subtitle="Estimated from prices"
        icon={DollarSign}
        color="amber"
        isLoading={isLoading}
        index={3}
      />
    </div>
  );
}
