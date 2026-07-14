import mongoose from "mongoose";
import { ShoppingList, PurchaseHistory } from "../models/index";
import { logger } from "../utils/logger";

/**
 * StatsService — aggregates shopping statistics for the dashboard.
 */
export class StatsService {
  async getStatsForUser(userId: string) {
    try {
      const uid = new mongoose.Types.ObjectId(userId);

      // Run all aggregations in parallel
      const [
        listStats,
        voiceCount,
        frequentItems,
        categoryBreakdown,
        weeklyActivity,
        totalSpent,
      ] = await Promise.all([
        this.getListStats(uid),
        this.getVoiceCommandCount(uid),
        PurchaseHistory.getFrequentItems(userId, 8),
        this.getCategoryBreakdown(uid),
        this.getWeeklyActivity(uid),
        this.getTotalSpent(uid),
      ]);

      return {
        totalItemsAdded: listStats.totalAdded,
        totalItemsChecked: listStats.totalChecked,
        voiceCommandsUsed: voiceCount,
        mostPurchasedItems: frequentItems,
        categoryBreakdown,
        weeklyActivity,
        totalSpent,
      };
    } catch (error) {
      logger.error("getStatsForUser error:", error);
      throw error;
    }
  }

  private async getListStats(userId: mongoose.Types.ObjectId) {
    const result = await ShoppingList.aggregate([
      { $match: { userId } },
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalAdded: { $sum: 1 },
          totalChecked: {
            $sum: { $cond: [{ $eq: ["$items.checked", true] }, 1, 0] },
          },
        },
      },
    ]);
    return result[0] ?? { totalAdded: 0, totalChecked: 0 };
  }

  private async getVoiceCommandCount(
    userId: mongoose.Types.ObjectId
  ): Promise<number> {
    const result = await ShoppingList.aggregate([
      { $match: { userId } },
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
      { $match: { "items.addedVoice": true } },
      { $count: "total" },
    ]);
    return result[0]?.total ?? 0;
  }

  private async getCategoryBreakdown(userId: mongoose.Types.ObjectId) {
    return PurchaseHistory.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  private async getWeeklyActivity(userId: mongoose.Types.ObjectId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const result = await PurchaseHistory.aggregate([
      {
        $match: {
          userId,
          purchasedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchasedAt" },
          },
          items: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          day: "$_id",
          items: 1,
        },
      },
    ]);

    // Fill missing days with 0
    const days: Array<{ day: string; items: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const found = result.find((r) => r.day === key);
      days.push({ day: key, items: found?.items ?? 0 });
    }
    return days;
  }

  private async getTotalSpent(
    userId: mongoose.Types.ObjectId
  ): Promise<number> {
    const result = await PurchaseHistory.aggregate([
      { $match: { userId, price: { $exists: true, $gt: 0 } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);
    return result[0]?.total ?? 0;
  }
}
