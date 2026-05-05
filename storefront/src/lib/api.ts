import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ── Request: attach Bearer token if present ────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: unwrap ApiResponse wrapper ───────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Our backend always wraps in { success, message, data }
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data
    ) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong";

    // Auto-clear tokens on 401
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
