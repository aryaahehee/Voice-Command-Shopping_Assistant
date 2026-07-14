import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types";

/**
 * AuthService — handles registration, login, token management.
 * Mongoose model integration is wired in Milestone 4.
 */
export class AuthService {
  // ── Token helpers ────────────────────────────────────────

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

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  // ── User operations (stubs — connected to DB in M4) ─────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByEmail(_email: string): Promise<null> {
    // TODO: replaced in M4 with User.findOne({ email })
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findById(_id: string): Promise<null> {
    // TODO: replaced in M4 with User.findById(id)
    return null;
  }

  async register(_input: { name: string; email: string; password: string }) {
    // TODO: full implementation in M4
    throw new Error("DB not yet connected — implement in Milestone 4");
  }

  async login(
    _email: string,
    _password: string
  ): Promise<null> {
    // TODO: full implementation in M4
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revokeRefreshToken(_token: string): Promise<void> {
    // TODO: store invalidated tokens in DB (M4)
  }

  async refreshAccessToken(_token: string): Promise<null> {
    // TODO: verify against DB refresh tokens (M4)
    return null;
  }
}
