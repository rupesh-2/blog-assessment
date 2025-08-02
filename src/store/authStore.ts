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

      login: async (email: string, _password: string) => {
        console.log("Login attempt for email:", email);
        set({ isLoading: true, error: null });
        try {
          const { registeredUsers } = get();
          console.log("Registered users:", registeredUsers);
          const user = registeredUsers.find((u) => u.email === email);
          console.log("Found user:", user);

          if (user) {
            // Create JWT token
            const token = createMockJWT(user);
            setToken(token);
            console.log("Created token and set user:", user);

            set({
              user,
              token,
              isLoading: false,
            });
          } else {
            console.log("User not found for email:", email);
            throw new Error("User not found. Please register first.");
          }
        } catch (error) {
          console.error("Login error:", error);
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, _password: string) => {
        console.log("Register attempt for:", { name, email });
        set({ isLoading: true, error: null });
        try {
          const { registeredUsers } = get();
          console.log("Current registered users:", registeredUsers);
          const existingUser = registeredUsers.find((u) => u.email === email);

          if (existingUser) {
            console.log("User already exists:", existingUser);
            throw new Error("User with this email already exists");
          }

          const newUser: User = {
            id: registeredUsers.length + 1,
            name,
            email,
          };

          console.log("Creating new user:", newUser);
          set({
            registeredUsers: [...registeredUsers, newUser],
            isLoading: false,
          });
          console.log("User registered successfully:", newUser);
        } catch (error) {
          console.error("Registration error:", error);
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
        user: state.user,
        token: state.token,
        registeredUsers: state.registeredUsers,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if we have a valid token and set user accordingly
          if (state.token && isTokenValid(state.token)) {
            const decoded = decodeToken(state.token);
            if (decoded) {
              state.user = decoded;
            }
          } else {
            state.user = null;
            state.token = null;
          }
        }
      },
    }
  )
);
