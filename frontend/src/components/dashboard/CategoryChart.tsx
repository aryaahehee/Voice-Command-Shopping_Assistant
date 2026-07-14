"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/useStats";
import { ITEM_CATEGORIES } from "@/lib/constants";

const CHART_COLORS = [
  "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#6366f1", "#84cc16",
];

export function CategoryChart() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const data = (stats?.categoryBreakdown ?? [])
    .filter((c) => c.count > 0)
    .map((c) => ({
      name: ITEM_CATEGORIES.find((cat) => cat.value === c.category)?.label ?? c.category,
      value: c.count,
      emoji: ITEM_CATEGORIES.find((cat) => cat.value === c.category)?.emoji ?? "📦",
    }));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-semibold text-sm">By Category</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Purchase breakdown by type
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No category data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Legend
              iconSize={8}
              iconType="circle"
              formatter={(val) => (
                <span style={{ fontSize: "11px" }}>{val}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
