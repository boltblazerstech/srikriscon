"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import toast from "react-hot-toast";

interface RegisterFormValues {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  password:  string;
  confirm:   string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { value: storeName } = useSetting("storeName");
  const { register: registerUser, login, isAuthenticated } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  useEffect(() => {
    if (isAuthenticated) router.replace("/account/overview");
  }, [isAuthenticated, router]);

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser({
        email:     values.email,
        password:  values.password,
        firstName: values.firstName,
        lastName:  values.lastName,
        phone:     values.phone || undefined,
      });
      // Auto-login after successful registration
      await login({ email: values.email, password: values.password });
      toast.success("Account created! Welcome 🎉");
      router.replace("/account/overview");
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl border border-border shadow-[0_4px_32px_-8px_rgba(0,0,0,0.1)] p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary">Create account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join {storeName || theme.business.name} for exclusive packaging solutions</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.firstName ? "border-destructive" : "border-border"}`}
                  {...register("firstName", { required: "Required" })}
                />
                {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Smith"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.lastName ? "border-destructive" : "border-border"}`}
                  {...register("lastName", { required: "Required" })}
                />
                {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.email ? "border-destructive" : "border-border"}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                {...register("phone")}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.password ? "border-destructive" : "border-border"}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" },
                  })}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
              <input
                id="confirm"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.confirm ? "border-destructive" : "border-border"}`}
                {...register("confirm", {
                  required: "Please confirm your password",
                  validate: (v) => v === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(11,58,66,0.3)] mt-2"
            >
              {isSubmitting ? "Creating account…" : (
                <>Create account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
