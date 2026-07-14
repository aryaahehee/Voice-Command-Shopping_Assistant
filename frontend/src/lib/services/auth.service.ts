import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Frontend auth API service.
 * All calls go to /api/auth/* on the Express backend.
 */
export const authService = {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const { data } = await api.post<ApiResponse<AuthTokens>>(
      "/auth/register",
      input
    );
    if (!data.data) throw new Error(data.error ?? "Registration failed");
    return data.data;
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    const { data } = await api.post<ApiResponse<AuthTokens>>(
      "/auth/login",
      input
    );
    if (!data.data) throw new Error(data.error ?? "Login failed");
    return data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    if (!data.data) throw new Error(data.error ?? "Failed to fetch profile");
    return data.data;
  },

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string }> {
    const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      { refreshToken: token }
    );
    if (!data.data) throw new Error(data.error ?? "Token refresh failed");
    return data.data;
  },
};

export { getErrorMessage };
