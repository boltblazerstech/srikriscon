"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ArrowLeft, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/src/lib/api";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import Button from "@/src/components/ui/Button";

interface ResetPasswordFormValues {
  newPassword:      string;
  confirmPassword:  string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { value: storeName } = useSetting("storeName");

  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();

  const newPassword = watch("newPassword");

  // Validate the token on component mount
  useEffect(() => {
    if (!token) {
      setValidationError("Missing password reset token. Please request a new link.");
      setIsValidating(false);
      return;
    }

    async function checkToken() {
      try {
        // Backend: GET /api/auth/validate-reset-token?token=...
        await api.get(`/api/auth/validate-reset-token`, { params: { token } });
        setIsValidating(false);
      } catch (err: any) {
        setValidationError(err?.message ?? "Invalid or expired reset token. Please try again.");
        setIsValidating(false);
      }
    }

    checkToken();
  }, [token]);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    try {
      // Backend expects: POST /api/auth/reset-password with { token, newPassword, confirmPassword }
      await api.post("/api/auth/reset-password", {
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setIsSuccess(true);
      toast.success("Password updated successfully!");
      
      // Auto-redirect to login after 5 seconds
      const timer = setTimeout(() => {
        router.push("/login");
      }, 5000);
      return () => clearTimeout(timer);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to reset password. Please try again.");
    }
  }

  // 1. Loading State
  if (isValidating) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying reset token...</p>
        </div>
      </main>
    );
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
          <AnimatePresence mode="wait">
            {validationError ? (
              // 2. Token Error State
              <motion.div
                key="token-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="font-display text-2xl font-bold text-primary mb-2">Link Invalid or Expired</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {validationError}
                </p>
                <Button
                  onClick={() => router.push("/forgot-password")}
                  fullWidth
                >
                  Request a new link
                </Button>
                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            ) : !isSuccess ? (
              // 3. Reset Password Form Form
              <motion.div
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold text-primary">Reset password</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Please choose a strong password to secure your {storeName || theme.business.name} account.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPw ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                          errors.newPassword ? "border-destructive" : "border-border"
                        }`}
                        {...register("newPassword", {
                          required: "Password is required",
                          minLength: { value: 8, message: "Password must be at least 8 characters" },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfPw ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                          errors.confirmPassword ? "border-destructive" : "border-border"
                        }`}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (val) => val === newPassword || "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfPw(!showConfPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    icon={<KeyRound className="h-4 w-4" />}
                    fullWidth
                  >
                    Reset Password
                  </Button>
                </form>
              </motion.div>
            ) : (
              // 4. Success State
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-success animate-bounce" />
                </div>
                <h2 className="font-display text-2xl font-bold text-primary mb-2">Password Reset Complete</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-light">
                  Your password has been successfully updated. You will be automatically redirected to the login page shortly, or you can click below to sign in immediately.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  fullWidth
                >
                  Sign in now
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
