import mongoose, { Schema, Document } from "mongoose";

/**
 * RefreshToken model — stores hashed refresh tokens with expiry.
 * Allows secure token rotation and individual session revocation.
 */
export interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;   // bcrypt hash of the raw token
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index — auto-deletes expired documents
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
