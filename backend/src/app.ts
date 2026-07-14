import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { router as apiRouter } from "./routes";

/**
 * Creates and configures the Express application.
 * Exported separately from server.ts so it can be imported in tests.
 */
export function createApp(): Application {
  const app = express();

  // ── Security headers ───────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // ── CORS ───────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ── Body parsing ───────────────────────────────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // ── Compression ────────────────────────────────────────────
  app.use(compression());

  // ── Request logging ────────────────────────────────────────
  app.use(requestLogger);

  // ── Health check (no auth, no rate limit) ──────────────────
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      service: "voicecart-api",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ── API routes with rate limiting ──────────────────────────
  app.use("/api", apiLimiter, apiRouter);

  // ── 404 catch-all ──────────────────────────────────────────
  app.use(notFoundHandler);

  // ── Global error handler (must be last) ────────────────────
  app.use(errorHandler);

  return app;
}
