// JWT utility functions with proper token handling
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
    // Decode JWT token (base64 decode the payload)
    const payload = token.split(".")[1];
    if (!payload) return false;

    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    return decodedPayload.exp > currentTime;
  } catch {
    return false;
  }
};

export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const createMockJWT = (userData: any): string => {
  // Create a mock JWT token for demonstration
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

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  // Create signature (mock)
  const signature = btoa("mock-signature-" + Date.now());

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
