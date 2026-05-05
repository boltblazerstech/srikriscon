"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useMyOrder } from "@/src/hooks/useOrders";
import { useTrackOrder } from "@/src/hooks/useOrders";
import Button from "@/src/components/ui/Button";
import Spinner from "@/src/components/ui/Spinner";
import { formatDate, formatPrice, cn } from "@/src/lib/utils";
import type { OrderStatus } from "@/src/types";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "PLACED",    label: "Order Placed",   icon: Package },
  { status: "CONFIRMED", label: "Confirmed",       icon: CheckCircle },
  { status: "PROCESSING",label: "Processing",      icon: Clock },
  { status: "SHIPPED",   label: "Shipped",         icon: Truck },
  { status: "DELIVERED", label: "Delivered",       icon: CheckCircle },
];

const ORDER_INDEX: Record<OrderStatus, number> = {
  PLACED: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4,
  CANCELLED: -1, REFUNDED: -1,
};

export default function TrackPage() {
  const [inputId, setInputId] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: order, isLoading: orderLoading } = useMyOrder(orderId);
  const { data: shipment, isLoading: shipLoading } = useTrackOrder(orderId);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(inputId.trim());
    if (!isNaN(n) && n > 0) setOrderId(n);
  }

  const currentIdx = order ? ORDER_INDEX[order.status] : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">Track Your Order</h1>
      <p className="text-muted-foreground mb-8">Enter your order ID to see the latest status.</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Order ID (e.g. 1234)"
          className="flex-1 h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" icon={<Search className="h-4 w-4" />} size="lg">
          Track
        </Button>
      </form>

      {(orderLoading || shipLoading) && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Order Number</p>
                <p className="font-bold">{order.orderNumber}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Placed {formatDate(order.createdAt)}
            </p>

            {/* Status timeline */}
            {order.status !== "CANCELLED" && order.status !== "REFUNDED" ? (
              <div className="relative">
                <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-border" />
                <ol className="space-y-5 relative">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentIdx;
                    const current = i === currentIdx;
                    return (
                      <li key={step.status} className="flex items-center gap-4">
                        <div
                          className={cn(
                            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                            done
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white text-muted-foreground"
                          )}
                        >
                          <step.icon className="h-3.5 w-3.5" />
                          {current && (
                            <span className="absolute -inset-1 rounded-full animate-ping bg-primary/30" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            done ? "font-medium text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3 font-medium">
                Order {order.status === "CANCELLED" ? "Cancelled" : "Refunded"}
              </div>
            )}
          </div>

          {/* Shipment info */}
          {shipment?.awbCode && (
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Shipment Details
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">AWB Code</dt>
                  <dd className="font-mono font-medium">{shipment.awbCode}</dd>
                </div>
                {shipment.status && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Status</dt>
                    <dd className="font-medium">{shipment.status}</dd>
                  </div>
                )}
                {shipment.estimatedDelivery && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Est. Delivery</dt>
                    <dd className="font-medium">{formatDate(shipment.estimatedDelivery)}</dd>
                  </div>
                )}
              </dl>
              {shipment.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  Track on carrier site →
                </a>
              )}
            </div>
          )}

          {/* Items summary */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName}
                    {item.variantValue ? ` (${item.variantValue})` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {orderId && !orderLoading && !order && (
        <p className="text-center text-muted-foreground py-8">
          No order found with ID {orderId}. Make sure you are logged in and the ID is correct.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; cls: string }> = {
    PLACED:     { label: "Placed",     cls: "bg-primary/10 text-primary" },
    CONFIRMED:  { label: "Confirmed",  cls: "bg-primary/10 text-primary" },
    PROCESSING: { label: "Processing", cls: "bg-warning/10 text-warning" },
    SHIPPED:    { label: "Shipped",    cls: "bg-primary/10 text-primary" },
    DELIVERED:  { label: "Delivered",  cls: "bg-success/10 text-success" },
    CANCELLED:  { label: "Cancelled",  cls: "bg-destructive/10 text-destructive" },
    REFUNDED:   { label: "Refunded",   cls: "bg-muted text-muted-foreground" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-muted" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}
