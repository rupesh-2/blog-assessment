import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createMockJWT,
  decodeToken,
  isTokenValid,
  setToken,
  removeToken,
} from "../utils/jwt";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Mock login - in real app, this would be an API call
          if (email === "admin@example.com" && password === "password") {
            const mockUser: User = {
              id: 1,
              name: "Admin User",
              email: email,
            };

            // Create a proper JWT token
            const token = createMockJWT(mockUser);

            // Store token in localStorage
            setToken(token);

            set({
              user: mockUser,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Remove token from localStorage
        removeToken();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { token } = get();

        if (token && isTokenValid(token)) {
          // Decode token to get user info
          const decoded = decodeToken(token);
          if (decoded) {
            set({
              user: {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
              },
              isAuthenticated: true,
            });
          }
        } else {
          // Token is invalid or expired
          removeToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        // Check auth status when store is rehydrated
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);
