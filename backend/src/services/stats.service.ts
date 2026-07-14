import { logger } from "../utils/logger";

/**
 * StatsService — aggregates shopping statistics for the dashboard.
 * Full aggregation pipeline wired in Milestone 9 once models exist.
 */
export class StatsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getStatsForUser(_userId: string) {
    try {
      // TODO: replace with real MongoDB aggregations in M9
      return {
        totalItemsAdded: 0,
        totalItemsChecked: 0,
        voiceCommandsUsed: 0,
        mostPurchasedItems: [],
        categoryBreakdown: [],
        weeklyActivity: this.emptyWeek(),
        totalSpent: 0,
      };
    } catch (error) {
      logger.error("getStatsForUser error:", error);
      throw error;
    }
  }

  /** Returns a zero-filled 7-day activity array (Mon–Sun). */
  private emptyWeek() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({ day, items: 0 }));
  }
}
