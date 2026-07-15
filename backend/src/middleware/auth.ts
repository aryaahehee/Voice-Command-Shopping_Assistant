import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest, JwtPayload } from "../types";
import { sendUnauthorized } from "../utils/apiResponse";
import { Types } from "mongoose";

/**
 * Verifies the Bearer JWT in the Authorization header.
 * Attaches the decoded user payload to req.user.
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendUnauthorized(res, "No token provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      _id: new Types.ObjectId(decoded.userId),
      email: decoded.email,
      name: "",
    };
    next();
  } catch {
    sendUnauthorized(res, "Invalid or expired token");
  }
}

/**
 * Optional authentication — attaches user if token is present but does NOT
 * block the request if missing. Used on public routes that show richer data
 * for authenticated users.
 */
export function optionalAuthenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      _id: new Types.ObjectId(decoded.userId),
      email: decoded.email,
      name: "",
    };
  } catch {
    // Ignore invalid token for optional routes
  }

  next();
}
