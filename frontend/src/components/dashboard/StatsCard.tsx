"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "violet" | "green" | "blue" | "amber" | "rose";
  trend?: { value: number; label: string };
  isLoading?: boolean;
  index?: number;
}

const COLOR_MAP = {
  violet: { bg: "bg-violet-500/10", icon: "text-violet-500", border: "border-violet-500/20" },
  green:  { bg: "bg-green-500/10",  icon: "text-green-500",  border: "border-green-500/20" },
  blue:   { bg: "bg-blue-500/10",   icon: "text-blue-500",   border: "border-blue-500/20" },
  amber:  { bg: "bg-amber-500/10",  icon: "text-amber-500",  border: "border-amber-500/20" },
  rose:   { bg: "bg-rose-500/10",   icon: "text-rose-500",   border: "border-rose-500/20" },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "violet",
  trend,
  isLoading = false,
  index = 0,
}: StatsCardProps) {
  const c = COLOR_MAP[color];

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
        c.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", c.bg)}>
          <Icon className={cn("h-5 w-5", c.icon)} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "font-medium",
              trend.value >= 0 ? "text-green-500" : "text-rose-500"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
