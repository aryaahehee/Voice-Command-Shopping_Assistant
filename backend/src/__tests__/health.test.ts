/**
 * Health check endpoint smoke test.
 * Uses supertest so no real DB connection is needed.
 */
import request from "supertest";
import { createApp } from "../app";

// Suppress winston output during tests
jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Prevent env from throwing on missing MONGODB_URI etc. in CI
jest.mock("../config/env", () => ({
  env: {
    NODE_ENV: "test",
    PORT: 5000,
    MONGODB_URI: "mongodb://localhost:27017/test",
    JWT_SECRET: "test_secret_32_chars_long_enough!",
    JWT_REFRESH_SECRET: "test_refresh_secret_32_chars_ok!",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    OPENAI_API_KEY: "",
    OPENAI_MODEL: "gpt-4o-mini",
    CLIENT_URL: "http://localhost:3000",
    RATE_LIMIT_WINDOW_MS: 900000,
    RATE_LIMIT_MAX: 100,
    isDev: () => false,
    isProd: () => false,
    isTest: () => true,
  },
}));

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const app = createApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("voicecart-api");
  });
});

describe("GET /api/unknown-route", () => {
  it("returns 404 for unknown routes", async () => {
    const app = createApp();
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
