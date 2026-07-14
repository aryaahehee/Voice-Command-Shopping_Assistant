import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

/**
 * Application-wide logger using Winston.
 * - Console output in development
 * - Rotating file logs in production
 */
export const logger = winston.createLogger({
  level: env.isDev() ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Always log to console
    new winston.transports.Console({
      format: env.isDev()
        ? combine(colorize(), timestamp({ format: "HH:mm:ss" }), logFormat)
        : combine(timestamp(), logFormat),
    }),

    // Rotate daily log files (production / staging)
    ...(env.isProd()
      ? [
          new DailyRotateFile({
            dirname: "logs",
            filename: "voicecart-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: "info",
          }),
          new DailyRotateFile({
            dirname: "logs",
            filename: "voicecart-error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "30d",
            level: "error",
          }),
        ]
      : []),
  ],
});
