"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/src/config/api";
import { extractApiError } from "@/src/lib/utils";

const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters"),
    confirm:  z.string().min(1, "Required"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    try {
      await api.post("/api/admin/auth/reset-password", {
        token,
        newPassword: data.password,
      });
      setDone(true);
    } catch (err) {
      setError(extractApiError(err));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-fg text-xl font-bold mb-4">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-foreground">New Password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Choose a strong new password.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
          {done ? (
            <div className="text-center py-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success-light text-success mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">Password updated!</p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!token && (
                <div className="rounded-lg bg-destructive-light border border-destructive/20 text-destructive text-sm px-4 py-3">
                  Invalid or missing reset token.
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-destructive-light border border-destructive/20 text-destructive text-sm px-4 py-3">
                  {error}
                </div>
              )}

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPw ? "text" : "password"}
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    placeholder="Min. 8 characters"
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

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm Password
                </label>
                <input
                  {...register("confirm")}
                  type="password"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="Repeat password"
                />
                {errors.confirm && (
                  <p className="text-xs text-destructive mt-1">{errors.confirm.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="w-full h-10 rounded-lg bg-primary text-primary-fg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
