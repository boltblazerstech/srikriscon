"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:     "bg-primary text-primary-fg hover:bg-primary-hover",
  secondary:   "bg-muted text-foreground hover:bg-border",
  outline:     "border border-border bg-white text-foreground hover:bg-muted",
  ghost:       "text-foreground hover:bg-muted",
  destructive: "bg-destructive text-destructive-fg hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-3 text-xs gap-1.5",
  md: "h-9  px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          iconPosition === "left" && icon
        )}
        {children}
        {!loading && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
