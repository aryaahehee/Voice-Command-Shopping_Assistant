import api from "@/lib/api";
import type { ApiResponse, Recommendation } from "@/types";

export interface SubstituteResult {
  item: string;
  substitutes: Recommendation[];
}

/**
 * Frontend recommendation API service.
 */
export const recommendationService = {
  async getPersonalised(): Promise<Recommendation[]> {
    const { data } =
      await api.get<ApiResponse<Recommendation[]>>("/recommendations");
    return data.data ?? [];
  },

  async getSeasonal(): Promise<Recommendation[]> {
    const { data } =
      await api.get<ApiResponse<Recommendation[]>>("/recommendations/seasonal");
    return data.data ?? [];
  },

  async getSubstitutes(itemName: string): Promise<SubstituteResult> {
    const encoded = encodeURIComponent(itemName);
    const { data } = await api.get<ApiResponse<SubstituteResult>>(
      `/recommendations/substitutes/${encoded}`
    );
    return data.data ?? { item: itemName, substitutes: [] };
  },
};
