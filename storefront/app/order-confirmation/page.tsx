"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useMyOrder } from "@/src/hooks/useOrders";
import Button from "@/src/components/ui/Button";
import Spinner from "@/src/components/ui/Spinner";
import { formatPrice, formatDate } from "@/src/lib/utils";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Spinner size="lg" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId");
  const { data: order, isLoading } = useMyOrder(orderId ? Number(orderId) : null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <motion.div
            initial={{ scale: 1.5, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 rounded-full bg-success/20"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Order Confirmed! 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. We&apos;ll send you an update when your order ships.
        </p>
      </motion.div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl border border-border bg-white text-left p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Order Number</p>
              <p className="font-bold text-foreground">{order.orderNumber}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Placed on</p>
              <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="h-px bg-border mb-4" />

          {/* Items */}
          <div className="space-y-2 mb-4">
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

          <div className="h-px bg-border mb-4" />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.shippingAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(order.shippingAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
              <span>Total Paid</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium mb-0.5">Delivering to</p>
            <p className="text-muted-foreground">
              {order.shippingName}, {order.shippingLine1}
              {order.shippingLine2 && `, ${order.shippingLine2}`},{" "}
              {order.shippingCity}, {order.shippingState} — {order.shippingPostalCode}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link href="/track">
          <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
            Track Order
          </Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </motion.div>
    </div>
  );
}
