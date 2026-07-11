import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      <span className={cn("text-muted-foreground font-medium animate-pulse", textSizes[size])}>
        Loading
      </span>
    </div>
  );
}
