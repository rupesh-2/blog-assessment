import { User } from "../store/authStore";

// JWT token management
const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp > currentTime;
  } catch {
    return false;
  }
};

export const decodeToken = (token: string): any => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const createMockJWT = (userData: User): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    ...userData,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    iss: "blog-platform",
    aud: "blog-users",
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature-" + Date.now());
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
