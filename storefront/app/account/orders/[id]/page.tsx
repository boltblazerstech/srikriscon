"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";
import { useMyOrder, useCancelOrder } from "@/src/hooks/useOrders";
import { OrderStatusBadge, PaymentStatusBadge } from "@/src/components/account/OrderStatusBadge";
import { formatPrice, parseSafeDate } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";
import toast from "react-hot-toast";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = parseInt(id, 10);

  const { data: order, isLoading } = useMyOrder(isNaN(orderId) ? null : orderId);
  const { mutateAsync: cancel, isPending: cancelling } = useCancelOrder();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancel(orderId);
      toast.success("Order cancelled");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not cancel order");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
        <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-semibold text-foreground">Order not found</p>
        <Link href="/account/orders" className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    );
  }

  const canCancel = order.status === "PLACED";
  const shippingAddress = [
    order.shippingLine1,
    order.shippingLine2,
    order.shippingCity,
    order.shippingState,
    order.shippingPostalCode,
    order.shippingCountry,
  ].filter(Boolean).join(", ");

  return (
    <div className="space-y-5">

      {/* Back + Header */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Order #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {parseSafeDate(order.createdAt).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* AWB */}
        {order.awbCode && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-4 py-2.5">
            <Truck className="h-4 w-4 text-primary" />
            Tracking: <span className="font-mono font-semibold text-foreground">{order.awbCode}</span>
          </div>
        )}

        {/* Cancel button */}
        {canCancel && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50 underline-offset-2 hover:underline transition-colors"
            >
              {cancelling ? "Cancelling…" : "Cancel this order"}
            </button>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <h2 className="text-sm font-semibold text-foreground px-6 py-4 border-b border-border">
          Order Items ({order.items.length})
        </h2>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between px-6 py-4 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                {item.variantType && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.variantType}: {item.variantValue}
                  </p>
                )}
                {item.productSku && (
                  <p className="text-xs text-muted-foreground font-mono">SKU: {item.productSku}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">{formatPrice(item.totalPrice)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border px-6 py-4 space-y-2">
          {[
            { label: "Subtotal",   value: order.subtotal },
            { label: "Shipping",   value: order.shippingAmount },
            { label: "Tax",        value: order.taxAmount },
            order.discountAmount > 0 && { label: "Discount", value: -order.discountAmount },
          ].filter(Boolean).map((row: any) => (
            <div key={row.label} className="flex justify-between text-sm text-muted-foreground">
              <span>{row.label}</span>
              <span className={row.value < 0 ? "text-green-600" : ""}>{formatPrice(Math.abs(row.value))}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Shipping Address</h2>
        </div>
        <p className="text-sm font-semibold text-foreground">{order.shippingName}</p>
        <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
        <p className="text-sm text-muted-foreground mt-1">{shippingAddress}</p>
        {order.notes && (
          <p className="text-sm text-muted-foreground mt-2 italic">&ldquo;{order.notes}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
