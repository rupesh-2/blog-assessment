// JWT utility functions
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth-token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token");
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    // In a real app, you would decode and verify the JWT
    // For now, we'll just check if it exists and has the expected format
    return token.startsWith("mock-jwt-token-");
  } catch {
    return false;
  }
};
