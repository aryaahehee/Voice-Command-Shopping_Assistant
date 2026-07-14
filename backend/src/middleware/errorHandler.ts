import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { env } from "../config/env";

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in the middleware chain.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError
      ? err.message
      : env.isDev()
      ? err.message
      : "Internal server error";

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} — ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`${statusCode} — ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    // Only expose stack trace in development
    ...(env.isDev() && { stack: err.stack }),
  });
}

/**
 * Catch-all for routes that don't exist.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
