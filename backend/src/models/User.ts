import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ── Sub-document: user preferences ─────────────────────────
export interface IUserPreferences {
  defaultLanguage: string;
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  voiceAutoStart: boolean;
}

// ── Main document interface ─────────────────────────────────
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  preferences: IUserPreferences;
  refreshTokens: string[];        // stored hashed refresh tokens
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): Omit<IUser, "password" | "refreshTokens">;
}

// ── Static methods interface ────────────────────────────────
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// ── Sub-schemas ─────────────────────────────────────────────
const preferencesSchema = new Schema<IUserPreferences>(
  {
    defaultLanguage:      { type: String, default: "en-US" },
    theme:                { type: String, enum: ["light", "dark", "system"], default: "system" },
    notificationsEnabled: { type: Boolean, default: true },
    voiceAutoStart:       { type: Boolean, default: false },
  },
  { _id: false }
);

// ── Main schema ─────────────────────────────────────────────
const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ─────────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// ── Pre-save: hash password ──────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance method: compare password ───────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: safe public object ─────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

// ── Static method: find by email ─────────────────────────────
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
