import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createMockJWT,
  setToken,
  removeToken,
  isTokenValid,
  decodeToken,
} from "../utils/jwt";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  registeredUsers: User[];

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      registeredUsers: [
        { id: 1, name: "Admin User", email: "admin@example.com" },
      ],

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { registeredUsers } = get();
          const user = registeredUsers.find((u) => u.email === email);

          if (user) {
            // Create JWT token
            const token = createMockJWT(user);
            setToken(token);

            set({
              user,
              token,
              isLoading: false,
            });
          } else {
            throw new Error("User not found. Please register first.");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { registeredUsers } = get();
          const existingUser = registeredUsers.find((u) => u.email === email);

          if (existingUser) {
            throw new Error("User with this email already exists");
          }

          const newUser: User = {
            id: registeredUsers.length + 1,
            name,
            email,
          };

          set({
            registeredUsers: [...registeredUsers, newUser],
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          token: null,
          error: null,
        });
      },

      checkAuth: () => {
        const { token } = get();
        if (token && isTokenValid(token)) {
          const decoded = decodeToken(token);
          if (decoded) {
            set({ user: decoded });
          }
        } else {
          set({ user: null, token: null });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);
