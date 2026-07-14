import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

// Ensure all schemas are registered at startup
import "../models/index";

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Exits the process on failure — we treat DB unavailability as fatal.
 */
export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

/** Graceful disconnect — used in tests and SIGTERM handler */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected unexpectedly");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB runtime error:", err);
});
