import morgan from "morgan";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import { StreamOptions } from "morgan";

// Bridge Morgan output to Winston
const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

/**
 * HTTP request logger middleware.
 * Uses "dev" format in development and "combined" in production.
 */
export const requestLogger = morgan(env.isDev() ? "dev" : "combined", {
  stream,
  // Skip logging for health-check endpoint
  skip: (req) => req.url === "/health",
});
