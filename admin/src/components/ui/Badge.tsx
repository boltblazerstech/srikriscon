import { cn } from "@/src/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/src/types";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "muted" | "primary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:     "bg-muted text-foreground",
  primary:     "bg-primary-light text-primary",
  success:     "bg-success-light text-success",
  warning:     "bg-warning-light text-warning",
  destructive: "bg-destructive-light text-destructive",
  muted:       "bg-muted text-muted-foreground",
};

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const ORDER_STATUS_MAP: Record<OrderStatus, BadgeVariant> = {
  PLACED:     "primary",
  CONFIRMED:  "primary",
  PROCESSING: "warning",
  SHIPPED:    "primary",
  DELIVERED:  "success",
  CANCELLED:  "destructive",
  REFUNDED:   "muted",
};

const PAYMENT_STATUS_MAP: Record<PaymentStatus, BadgeVariant> = {
  PENDING:  "warning",
  PAID:     "success",
  FAILED:   "destructive",
  REFUNDED: "muted",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={ORDER_STATUS_MAP[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_STATUS_MAP[status]}>{status}</Badge>;
}
