import { cn } from "@/src/lib/utils";

type BadgeVariant = "primary" | "accent" | "success" | "danger" | "muted" | "outline";

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  accent:  "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  danger:  "bg-destructive/10 text-destructive",
  muted:   "bg-muted text-muted-foreground",
  outline: "border border-border text-muted-foreground",
};




export default function Badge({
  children,
  variant = "muted",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
