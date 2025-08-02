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
  registeredUsers: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
      registeredUsers: [
        // Default admin user
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
        },
      ],

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { registeredUsers } = get();

          // Check if user exists in registered users
          const user = registeredUsers.find((u) => u.email === email);

          if (user) {
            // Create a proper JWT token
            const token = createMockJWT(user);

            // Store token in localStorage
            setToken(token);

            set({
              user: user,
              token: token,
              isAuthenticated: true,
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
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { registeredUsers } = get();

          // Check if user already exists
          const existingUser = registeredUsers.find((u) => u.email === email);
          if (existingUser) {
            throw new Error("User with this email already exists");
          }

          // Create new user
          const newUser: User = {
            id: registeredUsers.length + 1,
            name: name,
            email: email,
          };

          // Add to registered users
          const updatedUsers = [...registeredUsers, newUser];

          set({
            registeredUsers: updatedUsers,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
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
        registeredUsers: state.registeredUsers,
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
