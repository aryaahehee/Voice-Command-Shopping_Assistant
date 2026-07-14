"use client";

import { useState, useEffect, useCallback } from "react";
import { statsService } from "@/lib/services/stats.service";
import { getErrorMessage } from "@/lib/api";
import type { ShoppingStats } from "@/types";

export function useStats() {
  const [stats, setStats] = useState<ShoppingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statsService.getStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
