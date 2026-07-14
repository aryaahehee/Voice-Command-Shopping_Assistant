import api from "@/lib/api";
import type { ApiResponse, ShoppingStats } from "@/types";

export const statsService = {
  async getStats(): Promise<ShoppingStats> {
    const { data } = await api.get<ApiResponse<ShoppingStats>>("/stats");
    return (
      data.data ?? {
        totalItemsAdded: 0,
        totalItemsChecked: 0,
        voiceCommandsUsed: 0,
        mostPurchasedItems: [],
        categoryBreakdown: [],
        weeklyActivity: [],
        totalSpent: 0,
      }
    );
  },
};
