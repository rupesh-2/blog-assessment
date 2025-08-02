import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  } = useAuthStore();

  // Compute isAuthenticated based on user and token
  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };
};
