import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types";
import { sendSuccess } from "../utils/apiResponse";
import { RecommendationService } from "../services/recommendation.service";

const recService = new RecommendationService();

/**
 * GET /api/recommendations
 * Returns personalised item recommendations based on purchase history.
 */
export const getRecommendations = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const recommendations = await recService.getPersonalised(
      req.user!._id.toString()
    );
    sendSuccess(res, recommendations, "Recommendations fetched");
  }
);

/**
 * GET /api/recommendations/seasonal
 * Returns seasonal produce/item suggestions for the current month.
 */
export const getSeasonalSuggestions = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const suggestions = await recService.getSeasonal();
    sendSuccess(res, suggestions, "Seasonal suggestions fetched");
  }
);

/**
 * GET /api/recommendations/substitutes/:item
 * Returns substitute options for a given item name.
 */
export const getSubstitutes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const substitutes = await recService.getSubstitutes(req.params.item);
    sendSuccess(res, substitutes, "Substitutes fetched");
  }
);
