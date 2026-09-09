"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/src/lib/api";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import Button from "@/src/components/ui/Button";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const { value: storeName } = useSetting("storeName");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>();

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      // Backend expects: POST /api/auth/forgot-password with { email }
      await api.post("/api/auth/forgot-password", { email: values.email });
      setIsSuccess(true);
      toast.success("Reset link request sent!");
    } catch (err: any) {
      // In case of any validation or network issues, show error toast
      toast.error(err?.message ?? "Failed to request password reset link");
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
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold text-primary">Forgot password?</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter your email address to receive a link to reset your {storeName || theme.business.name} account password.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
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
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    icon={<Mail className="h-4 w-4" />}
                    fullWidth
                  >
                    Send Reset Link
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to sign in
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-success animate-bounce" />
                </div>
                <h2 className="font-display text-2xl font-bold text-primary mb-2">Check your email</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  We have sent a password reset link to your email address. If you do not receive it within a few minutes, please check your spam folder.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to sign in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
