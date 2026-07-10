"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { extractApiError } from "@/src/lib/utils";

const schema = z.object({
  username: z.string().email("Must be a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const fillSuperAdmin = () => {
   
  };

  async function onSubmit(data: FormData) {
    setError("");
    try {
      await login(data.username, data.password);
      // login() calls router.push("/dashboard") internally
    } catch (err) {
      setError(extractApiError(err));
      console.error("Login error:", err);
    }
  }

  // Show spinner while auth state is being restored from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already logged in — render nothing while effect fires the redirect
  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-fg text-xl font-bold mb-4">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive-light border border-destructive/20 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                {...register("username")}
                type="email"
                autoComplete="email"
                className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder="admin@example.com"
              />
              {errors.username && (
                <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="button"
              onClick={fillSuperAdmin}
              className="w-full h-10 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors mb-2"
            >
              Fill SuperAdmin Credentials
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-lg bg-primary text-primary-fg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
