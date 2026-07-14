"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  recommendationService,
  type SubstituteResult,
} from "@/lib/services/recommendation.service";
import { getErrorMessage } from "@/lib/api";
import type { Recommendation } from "@/types";

interface RecommendationState {
  personalised: Recommendation[];
  seasonal: Recommendation[];
  isLoading: boolean;
  error: string | null;
}

/**
 * useRecommendations — fetches all recommendation types on mount.
 * Also exposes a getSubstitutes() imperative call.
 */
export function useRecommendations() {
  const [state, setState] = useState<RecommendationState>({
    personalised: [],
    seasonal: [],
    isLoading: false,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const [personalised, seasonal] = await Promise.all([
        recommendationService.getPersonalised(),
        recommendationService.getSeasonal(),
      ]);
      setState({ personalised, seasonal, isLoading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: getErrorMessage(err),
      }));
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getSubstitutes = useCallback(
    async (itemName: string): Promise<SubstituteResult> => {
      try {
        return await recommendationService.getSubstitutes(itemName);
      } catch (err) {
        toast.error(getErrorMessage(err));
        return { item: itemName, substitutes: [] };
      }
    },
    []
  );

  return {
    ...state,
    refetch: fetchAll,
    getSubstitutes,
  };
}
