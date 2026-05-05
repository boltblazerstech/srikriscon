"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/src/lib/api";
import type { User, LoginRequest, RegisterRequest, AuthTokens } from "@/src/types";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const login = useCallback(async (req: LoginRequest) => {
    const tokens = await api
      .post<AuthTokens>("/api/auth/login", req)
      .then((r) => r.data);
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    const u: User = {
      id: tokens.userId!,
      email: tokens.email!,
      firstName: tokens.firstName,
      lastName: tokens.lastName,
      role: tokens.role ?? "CUSTOMER",
      active: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return tokens;
  }, []);

  const register = useCallback(async (req: RegisterRequest) => {
    await api.post("/api/auth/register", req);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(getToken());

  return { user, loading, isAuthenticated, login, register, logout };
}
