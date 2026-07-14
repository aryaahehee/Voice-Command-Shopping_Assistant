import axios, { type AxiosInstance, type AxiosError } from "axios";
import { API_BASE_URL, ACCESS_TOKEN_KEY } from "./constants";
import type { ApiResponse } from "@/types";

/**
 * Pre-configured Axios instance.
 * Automatically attaches the JWT Bearer token from localStorage and
 * handles 401 → redirect to /login.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach token if available (browser-only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Extract a human-readable error message from an Axios error.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as ApiResponse)?.error ||
      (error.response?.data as ApiResponse)?.message ||
      error.message ||
      "An unexpected error occurred."
    );
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
