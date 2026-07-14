import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { voiceLimiter } from "../middleware/rateLimiter";
import { parseVoiceCommand } from "../controllers/voice.controller";

const router = Router();

// POST /api/voice/parse
// Parse a raw voice transcript into a structured shopping command
router.post(
  "/parse",
  authenticate,
  voiceLimiter,
  [
    body("transcript")
      .trim()
      .notEmpty().withMessage("Transcript is required")
      .isLength({ max: 500 }).withMessage("Transcript too long"),
    body("language").optional().isString().isLength({ max: 10 }),
  ],
  validate,
  parseVoiceCommand
);

export default router;
