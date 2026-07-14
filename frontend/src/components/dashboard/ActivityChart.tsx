"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/useStats";

/**
 * ActivityChart — 7-day bar chart of items added/checked per day.
 */
export function ActivityChart() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const data =
    stats?.weeklyActivity.map((d) => ({
      day: new Date(d.day).toLocaleDateString("en-US", { weekday: "short" }),
      items: d.items,
    })) ?? [];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-semibold text-sm">Weekly Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Items added in the last 7 days
        </p>
      </div>

      {data.length === 0 || data.every((d) => d.items === 0) ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No activity yet — start adding items!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              cursor={{ fill: "hsl(var(--muted))" }}
            />
            <Bar
              dataKey="items"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Items"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
