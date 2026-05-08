"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import api from "@/src/lib/api";
import toast from "react-hot-toast";

interface PasswordFormValues {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>();

  async function onSubmit(values: PasswordFormValues) {
    try {
      await api.put("/api/users/me/password", {
        currentPassword: values.currentPassword,
        newPassword:     values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success("Password changed successfully");
      reset();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    }
  }

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Security</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage your password and account security</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-foreground">Change Password</h2>

          {/* Current password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1.5">
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.currentPassword ? "border-destructive" : "border-border"}`}
                {...register("currentPassword", { required: "Current password is required" })}
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1 text-xs text-destructive">{errors.currentPassword.message}</p>}
          </div>

          {/* New password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.newPassword ? "border-destructive" : "border-border"}`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                  validate: (v) =>
                    v !== watch("currentPassword") || "New password must differ from current",
                })}
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.confirmPassword ? "border-destructive" : "border-border"}`}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (v) => v === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      </form>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-800 mb-1.5">Password tips</h3>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Use at least 8 characters</li>
          <li>Mix letters, numbers, and symbols</li>
          <li>Don&apos;t reuse passwords from other sites</li>
        </ul>
      </div>
    </div>
  );
}
