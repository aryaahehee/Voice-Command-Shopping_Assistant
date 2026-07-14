/**
 * Auth service unit tests — test token generation and password hashing
 * without needing a live DB connection.
 */
import { AuthService } from "../services/auth.service";

// Mock the User and RefreshToken models so no DB is needed
jest.mock("../models/index", () => ({
  User: { findByEmail: jest.fn(), findById: jest.fn(), create: jest.fn() },
  RefreshToken: { create: jest.fn(), find: jest.fn(), updateMany: jest.fn() },
}));

jest.mock("../utils/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock("../config/env", () => ({
  env: {
    JWT_SECRET: "test_secret_at_least_32_characters_long!",
    JWT_REFRESH_SECRET: "test_refresh_secret_32_chars_long!!",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    isDev: () => false,
    isProd: () => false,
    isTest: () => true,
  },
}));

describe("AuthService", () => {
  const service = new AuthService();

  describe("hashPassword / comparePassword", () => {
    it("hashes a password and verifies it correctly", async () => {
      const hash = await service.hashPassword("SecurePass1");
      expect(hash).not.toBe("SecurePass1");
      const match = await service.comparePassword("SecurePass1", hash);
      expect(match).toBe(true);
    });

    it("rejects a wrong password", async () => {
      const hash = await service.hashPassword("SecurePass1");
      const match = await service.comparePassword("WrongPass1", hash);
      expect(match).toBe(false);
    });
  });

  describe("generateAccessToken", () => {
    it("generates a valid JWT string", () => {
      const token = service.generateAccessToken("user123", "test@example.com");
      expect(typeof token).toBe("string");
      // JWTs have 3 dot-separated parts
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("generateRefreshToken", () => {
    it("generates a different token to the access token", () => {
      const access = service.generateAccessToken("user123", "test@example.com");
      const refresh = service.generateRefreshToken("user123", "test@example.com");
      expect(access).not.toBe(refresh);
    });
  });
});
