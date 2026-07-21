import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, suffix, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full min-w-0">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full min-w-0">
          {prefix && (
            <div className="absolute left-3 text-muted-foreground flex items-center pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-9 px-3 rounded-lg border bg-white text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground min-w-0",
              error ? "border-destructive focus:ring-destructive/30" : "border-border",
              prefix && "pl-9",
              suffix && "pr-9",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 text-muted-foreground flex items-center pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-muted-foreground mt-1 break-words">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive mt-1 break-words">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
