import { cn } from "@/src/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/src/types";

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PLACED:     "bg-blue-50 text-blue-700 border border-blue-200",
  CONFIRMED:  "bg-primary/10 text-primary border border-primary/20",
  PROCESSING: "bg-amber-50 text-amber-700 border border-amber-200",
  SHIPPED:    "bg-purple-50 text-purple-700 border border-purple-200",
  DELIVERED:  "bg-green-50 text-green-700 border border-green-200",
  CANCELLED:  "bg-red-50 text-red-600 border border-red-200",
  REFUNDED:   "bg-gray-100 text-gray-600 border border-gray-200",
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED:     "Order: Placed",
  CONFIRMED:  "Order: Confirmed",
  PROCESSING: "Order: Processing",
  SHIPPED:    "Order: Shipped",
  DELIVERED:  "Order: Delivered",
  CANCELLED:  "Order: Cancelled",
  REFUNDED:   "Order: Refunded",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING:  "bg-amber-50 text-amber-700 border border-amber-200",
  PAID:     "bg-green-50 text-green-700 border border-green-200",
  FAILED:   "bg-red-50 text-red-600 border border-red-200",
  REFUNDED: "bg-gray-100 text-gray-600 border border-gray-200",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
      ORDER_STATUS_STYLES[status]
    )}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
      PAYMENT_STATUS_STYLES[status]
    )}>
      Payment: {label}
    </span>
  );
}
