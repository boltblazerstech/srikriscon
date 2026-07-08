"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import api from "@/src/lib/api";
import toast from "react-hot-toast";

interface ProfileFormValues {
  firstName: string;
  lastName:  string;
  phone:     string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>();

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName:  user.lastName  ?? "",
        phone:     user.phone     ?? "",
      });
    }
  }, [user, reset]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      await api.put("/api/users/me", {
        firstName: values.firstName.trim() || null,
        lastName:  values.lastName.trim()  || null,
        phone:     values.phone.trim()     || null,
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile");
    }
  }

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
        </div>
        <p className="text-sm text-muted-foreground">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.firstName ? "border-destructive" : "border-border"}`}
                {...register("firstName", { maxLength: { value: 50, message: "Max 50 characters" } })}
              />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.lastName ? "border-destructive" : "border-border"}`}
                {...register("lastName", { maxLength: { value: 50, message: "Max 50 characters" } })}
              />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
              Phone number
            </label>
            <input
              id="phone"
              type="number"
              autoComplete="tel"
              placeholder="98765 43210"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.phone ? "border-destructive" : "border-border"}`}
              {...register("phone", {
                pattern: { value: /^[+]?[0-9]{7,15}$/, message: "Enter a valid phone number" },
              })}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              disabled={!isDirty}
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-40 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
