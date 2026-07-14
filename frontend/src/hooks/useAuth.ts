"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/services/auth.service";
import { getErrorMessage } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/lib/services/auth.service";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";

/**
 * useAuth — primary hook for all authentication actions.
 * Wraps the Zustand auth store and calls the backend API.
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, login, logout, setLoading } =
    useAuthStore();

  const handleRegister = useCallback(
    async (input: RegisterInput) => {
      setLoading(true);
      try {
        const result = await authService.register(input);
        // Store refresh token in localStorage (access token stored by Zustand)
        localStorage.setItem("vc_refresh_token", result.refreshToken);
        login(result.user, result.accessToken);
        toast.success(`Welcome, ${result.user.name}!`);
        router.push("/dashboard");
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const handleLogin = useCallback(
    async (input: LoginInput) => {
      setLoading(true);
      try {
        const result = await authService.login(input);
        localStorage.setItem("vc_refresh_token", result.refreshToken);
        login(result.user, result.accessToken);
        toast.success(`Welcome back, ${result.user.name}!`);
        router.push("/dashboard");
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("vc_refresh_token");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Ignore errors on logout — clear state regardless
    } finally {
      localStorage.removeItem("vc_refresh_token");
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    }
  }, [logout, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
  };
}
