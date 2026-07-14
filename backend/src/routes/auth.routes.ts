import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";
import { authenticate } from "../middleware/auth";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
} from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  [
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Must be a valid email")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and a number"),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Must be a valid email")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// POST /api/auth/logout
router.post("/logout", authenticate, logout);

// POST /api/auth/refresh
router.post(
  "/refresh",
  [
    body("refreshToken")
      .notEmpty().withMessage("Refresh token is required"),
  ],
  validate,
  refreshToken
);

// GET /api/auth/me
router.get("/me", authenticate, getMe);

export default router;
