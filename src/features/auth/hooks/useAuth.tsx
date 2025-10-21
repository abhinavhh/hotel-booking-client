import { useState } from "react";
import api from "../../../lib/api";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
    token: localStorage.getItem("token"),
    user: null,
  });

  const login = async (formData: Record<string, any>) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Real backend call
      const response = await api.post("/auth/login", formData);

      // Extract token and user from response
      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token not found in response");
      }

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update auth state
      setAuthState({
        isLoading: false,
        error: null,
        isAuthenticated: true,
        token,
        user,
      });

      return { success: true, token, user };
    } catch (err: any) {
      // Handle different error types
      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // Backend returned an error response
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }

      setAuthState({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        token: null,
        user: null,
      });

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isLoading: false,
      error: null,
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  const register = async (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await api.post("/auth/register", data);
      const { user } = response.data;
      const token = null;
      setAuthState({
        isLoading: false,
        error: null,
        isAuthenticated: true,
        token,
        user,
      });

      return { success: true, token, user };
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          errorMessage;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setAuthState({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        token: null,
        user: null,
      });

      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    login,
    logout,
    register,
  };
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateEmail,
    validatePassword,
    clearErrors,
  };
};
