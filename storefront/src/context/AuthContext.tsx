"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/src/lib/api";
import type { LoginRequest, RegisterRequest, User } from "@/src/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

    if (!token) { setLoading(false); return; }

    // Optimistic: show stored user immediately while we verify
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }

    // Verify with server and get fresh data
    api.get<User>("/api/users/me")
      .then((r) => {
        setUser(r.data);
        localStorage.setItem("user", JSON.stringify(r.data));
      })
      .catch(() => {
        // Token invalid or expired — clear session
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (req: LoginRequest) => {
    const tokens = await api
      .post<{ accessToken: string; refreshToken: string; userId: number; email: string; firstName?: string; lastName?: string; role?: string }>("/api/auth/login", req)
      .then((r) => r.data);

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);

    // Immediately set partial user from token response
    const partial: User = {
      id: tokens.userId,
      email: tokens.email,
      firstName: tokens.firstName,
      lastName: tokens.lastName,
      role: (tokens.role ?? "CUSTOMER") as User["role"],
      active: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };
    setUser(partial);
    localStorage.setItem("user", JSON.stringify(partial));

    // Fetch full profile in background (includes phone, emailVerified, etc.)
    api.get<User>("/api/users/me")
      .then((r) => {
        setUser(r.data);
        localStorage.setItem("user", JSON.stringify(r.data));
      })
      .catch(() => { /* keep partial user */ });
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (req: RegisterRequest) => {
    await api.post("/api/auth/register", req);
    // Don't auto-login — let the caller redirect to /login
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    const rt = localStorage.getItem("refreshToken");
    if (rt) {
      api.post("/api/auth/logout", { refreshToken: rt }).catch(() => { /* best-effort */ });
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // ── Refresh profile from server ────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const r = await api.get<User>("/api/users/me");
    setUser(r.data);
    localStorage.setItem("user", JSON.stringify(r.data));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
