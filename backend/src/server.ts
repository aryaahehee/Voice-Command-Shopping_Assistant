import { createApp } from "./app";
import { connectDB, disconnectDB } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Create and start the Express server
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `VoiceCart API running on port ${env.PORT} [${env.NODE_ENV}]`
    );
  });

  // ── Graceful shutdown ──────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully…`);

    server.close(async () => {
      await disconnectDB();
      logger.info("Server closed. Goodbye.");
      process.exit(0);
    });

    // Force shutdown after 10 s if graceful close hangs
    setTimeout(() => {
      logger.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
    // In production, crash and let the process manager restart
    if (env.isProd()) {
      process.exit(1);
    }
  });
}

bootstrap().catch((err) => {
  logger.error("Bootstrap failed:", err);
  process.exit(1);
});
