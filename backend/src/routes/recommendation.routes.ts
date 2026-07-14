import { Router } from "express";
import { param } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
  getRecommendations,
  getSeasonalSuggestions,
  getSubstitutes,
} from "../controllers/recommendation.controller";

const router = Router();

router.use(authenticate);

// GET /api/recommendations
router.get("/", getRecommendations);

// GET /api/recommendations/seasonal
router.get("/seasonal", getSeasonalSuggestions);

// GET /api/recommendations/substitutes/:item
router.get(
  "/substitutes/:item",
  [param("item").trim().notEmpty().isLength({ max: 100 })],
  validate,
  getSubstitutes
);

export default router;
