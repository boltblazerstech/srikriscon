import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      // Extract a descriptive error message from the backend response if available
      const serverMessage = typeof error.response.data === "string"
        ? error.response.data
        : (error.response.data?.message || error.response.data?.error || error.response.statusText);

      if (serverMessage) {
        error.message = serverMessage;
      }

      if (error.response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/forgot-password" && path !== "/reset-password") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
