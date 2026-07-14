import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * General API rate limiter — applied to all /api routes.
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  skip: () => env.isTest(), // Disable in test environment
});

/**
 * Stricter limiter for auth endpoints (login, register).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts, please try again in 15 minutes.",
  },
  skip: () => env.isTest(),
});

/**
 * Limiter for AI / voice parsing endpoint — more expensive operations.
 */
export const voiceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Voice API rate limit exceeded. Please wait a moment.",
  },
  skip: () => env.isTest(),
});
