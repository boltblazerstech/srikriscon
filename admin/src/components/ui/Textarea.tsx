import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full min-w-0">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-white text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-y min-w-0 max-w-full",
            error ? "border-destructive focus:ring-destructive/30" : "border-border",
            className
          )}
          rows={props.rows ?? 4}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-muted-foreground mt-1 break-words">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive mt-1 break-words">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
