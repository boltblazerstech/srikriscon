"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMyOrders } from "@/src/hooks/useOrders";
import { OrderStatusBadge, PaymentStatusBadge } from "@/src/components/account/OrderStatusBadge";
import { formatPrice } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useMyOrders(page, 10);

  const orders     = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-border shadow-sm px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {data ? `${data.totalElements} order${data.totalElements !== 1 ? "s" : ""} total` : "Loading…"}
        </p>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/25 mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Once you place an order it will show up here.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              Browse products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">#{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="flex items-center gap-1 text-accent text-xs font-semibold hover:underline"
                        >
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block px-5 py-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                        {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
