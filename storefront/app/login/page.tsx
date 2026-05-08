"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/config/theme";
import toast from "react-hot-toast";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) router.replace(searchParams.get("from") ?? "/account/overview");
  }, [isAuthenticated, router, searchParams]);

  async function onSubmit(values: LoginFormValues) {
    try {
      await login({ email: values.email, password: values.password });
      toast.success("Welcome back!");
      router.replace(searchParams.get("from") ?? "/account/overview");
    } catch (err: any) {
      toast.error(err?.message ?? "Invalid email or password");
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-[0_4px_32px_-8px_rgba(0,0,0,0.1)] p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your {theme.business.name} account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    errors.password ? "border-destructive" : "border-border"
                  }`}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(11,58,66,0.3)]"
            >
              {isSubmitting ? "Signing in…" : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
