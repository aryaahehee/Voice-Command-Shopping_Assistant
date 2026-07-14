import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types";
import {
  sendCreated,
  sendSuccess,
  sendUnauthorized,
  sendConflict,
  sendBadRequest,
} from "../utils/apiResponse";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

/**
 * POST /api/auth/register
 * Creates a new user account and returns tokens.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await authService.findByEmail(email);
  if (existing) {
    sendConflict(res, "An account with this email already exists");
    return;
  }

  const { user, accessToken, refreshToken } = await authService.register({
    name,
    email,
    password,
  });

  sendCreated(res, { user, accessToken, refreshToken }, "Account created");
});

/**
 * POST /api/auth/login
 * Validates credentials and returns tokens.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const result = await authService.login(email, password);
  if (!result) {
    sendUnauthorized(res, "Invalid email or password");
    return;
  }

  sendSuccess(res, result, "Login successful");
});

/**
 * POST /api/auth/logout
 * Invalidates the provided refresh token.
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }
  sendSuccess(res, null, "Logged out");
});

/**
 * POST /api/auth/refresh
 * Issues a new access token given a valid refresh token.
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body as { refreshToken: string };

    const result = await authService.refreshAccessToken(token);
    if (!result) {
      sendUnauthorized(res, "Invalid or expired refresh token");
      return;
    }

    sendSuccess(res, result, "Token refreshed");
  }
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendUnauthorized(res);
    return;
  }

  const user = await authService.findById(req.user._id.toString());
  if (!user) {
    sendBadRequest(res, "User not found");
    return;
  }

  sendSuccess(res, user, "Profile fetched");
});
