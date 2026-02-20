import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  verifySession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      },

      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      },

      verifySession: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response: any = await api.get("/auth/me");
          set({
            user: response.user || response,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // If verification fails, try to refresh or logout
          console.error("Session verification failed:", error);
          set({ isLoading: false, isAuthenticated: false });
          // Note: The api utility interceptor will handle the refresh if it's a 401
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
