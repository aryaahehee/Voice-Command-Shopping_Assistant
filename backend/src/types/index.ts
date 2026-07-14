import { Request } from "express";
import { Types } from "mongoose";

/**
 * Extends Express Request with authenticated user info.
 * Set by the auth middleware after JWT verification.
 */
export interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    email: string;
    name: string;
  };
}

// Item category enum
export type ItemCategory =
  | "dairy"
  | "produce"
  | "bakery"
  | "meat"
  | "seafood"
  | "frozen"
  | "beverages"
  | "snacks"
  | "household"
  | "personal_care"
  | "other";

// Item unit enum
export type ItemUnit =
  | "pcs"
  | "kg"
  | "g"
  | "lb"
  | "oz"
  | "l"
  | "ml"
  | "dozen"
  | "pack"
  | "bottle"
  | "can"
  | "box"
  | "bag";

// Voice command action type
export type VoiceCommandAction =
  | "add"
  | "remove"
  | "update_quantity"
  | "check"
  | "uncheck"
  | "search"
  | "clear"
  | "unknown";

// Parsed voice command returned by the AI service
export interface ParsedVoiceCommand {
  action: VoiceCommandAction;
  itemName?: string;
  quantity?: number;
  unit?: ItemUnit;
  maxPrice?: number;
  brand?: string;
  rawTranscript: string;
  confidence: number;
}

// JWT payload stored in tokens
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
