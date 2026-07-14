import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types";
import { sendSuccess } from "../utils/apiResponse";
import { StatsService } from "../services/stats.service";

const statsService = new StatsService();

/**
 * GET /api/stats
 * Returns shopping statistics for the authenticated user's dashboard.
 */
export const getStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const stats = await statsService.getStatsForUser(
      req.user!._id.toString()
    );
    sendSuccess(res, stats, "Stats fetched");
  }
);
