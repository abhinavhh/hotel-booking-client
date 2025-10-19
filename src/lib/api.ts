import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to requests (except auth endpoints)
api.interceptors.request.use(
  (config) => {
    // Skip token for auth endpoints
    const authEndpoints = ["/auth/login", "/auth/register", "/auth/forgot-password"];
    const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if not on auth endpoints
    const authEndpoints = ["/auth/login", "/auth/register", "/auth/forgot-password"];
    const isAuthEndpoint = authEndpoints.some(endpoint => error.config?.url?.includes(endpoint));
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      console.warn("Unauthorized — redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;