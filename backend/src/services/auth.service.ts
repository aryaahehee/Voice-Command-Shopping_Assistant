import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types";
import { User, RefreshToken } from "../models/index";
import type { IUser } from "../models/index";

/**
 * AuthService — registration, login, token management.
 * Uses the User and RefreshToken Mongoose models.
 */
export class AuthService {
  // ── Token generation ─────────────────────────────────────

  generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email } satisfies Omit<JwtPayload, "iat" | "exp">,
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );
  }

  generateRefreshToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email } satisfies Omit<JwtPayload, "iat" | "exp">,
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );
  }

  // ── User lookups ─────────────────────────────────────────

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findByEmail(email);
  }

  async findById(id: string): Promise<Omit<IUser, "password" | "refreshTokens"> | null> {
    const user = await User.findById(id).select("-password -refreshTokens");
    return user;
  }

  // ── Registration ─────────────────────────────────────────

  async register(input: { name: string; email: string; password: string }) {
    const user = await User.create(input);

    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const rawRefreshToken = this.generateRefreshToken(
      user._id.toString(),
      user.email
    );

    await this.storeRefreshToken(user._id.toString(), rawRefreshToken);

    return {
      user: user.toSafeObject(),
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  // ── Login ─────────────────────────────────────────────────

  async login(email: string, password: string) {
    // Must explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) return null;

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) return null;

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const rawRefreshToken = this.generateRefreshToken(
      user._id.toString(),
      user.email
    );

    await this.storeRefreshToken(user._id.toString(), rawRefreshToken);

    return {
      user: user.toSafeObject(),
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  // ── Refresh token management ──────────────────────────────

  private async storeRefreshToken(
    userId: string,
    rawToken: string
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({ userId, tokenHash, expiresAt });
  }

  async refreshAccessToken(
    rawToken: string
  ): Promise<{ accessToken: string } | null> {
    try {
      const payload = jwt.verify(
        rawToken,
        env.JWT_REFRESH_SECRET
      ) as JwtPayload;

      // Find all valid (non-revoked, non-expired) tokens for this user
      const storedTokens = await RefreshToken.find({
        userId: payload.userId,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      });

      // Compare raw token against stored hashes
      let validRecord = null;
      for (const record of storedTokens) {
        const match = await bcrypt.compare(rawToken, record.tokenHash);
        if (match) { validRecord = record; break; }
      }

      if (!validRecord) return null;

      // Issue new access token
      const accessToken = this.generateAccessToken(
        payload.userId,
        payload.email
      );

      return { accessToken };
    } catch {
      return null;
    }
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    try {
      const payload = jwt.verify(
        rawToken,
        env.JWT_REFRESH_SECRET
      ) as JwtPayload;

      const storedTokens = await RefreshToken.find({
        userId: payload.userId,
        isRevoked: false,
      });

      for (const record of storedTokens) {
        const match = await bcrypt.compare(rawToken, record.tokenHash);
        if (match) {
          record.isRevoked = true;
          await record.save();
          break;
        }
      }
    } catch {
      // Token already invalid — nothing to do
    }
  }

  /** Revoke ALL refresh tokens for a user (e.g. on password change) */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
  }
}
