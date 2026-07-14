import { Router } from "express";
import authRoutes from "./auth.routes";
import listRoutes from "./list.routes";
import voiceRoutes from "./voice.routes";
import recommendationRoutes from "./recommendation.routes";
import statsRoutes from "./stats.routes";

export const router = Router();

/**
 * Mount all API sub-routers.
 * All routes are prefixed with /api (applied in app.ts).
 */
router.use("/auth", authRoutes);
router.use("/lists", listRoutes);
router.use("/voice", voiceRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/stats", statsRoutes);
