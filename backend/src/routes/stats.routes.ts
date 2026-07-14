import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getStats } from "../controllers/stats.controller";

const router = Router();

router.use(authenticate);

// GET /api/stats
router.get("/", getStats);

export default router;
