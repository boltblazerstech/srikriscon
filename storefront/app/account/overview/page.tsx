"use client";

import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle, Truck } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { useMyOrders } from "@/src/hooks/useOrders";
import { OrderStatusBadge } from "@/src/components/account/OrderStatusBadge";
import { formatPrice } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";

export default function OverviewPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useMyOrders(0, 5);

  const displayName = user?.firstName ?? user?.email?.split("@")[0] ?? "there";

  const totalOrders   = orders?.totalElements ?? 0;
  const recentOrders  = orders?.content ?? [];
  const deliveredCount  = recentOrders.filter((o) => o.status === "DELIVERED").length;
  const pendingCount    = recentOrders.filter((o) =>
    ["PLACED", "CONFIRMED", "PROCESSING"].includes(o.status)
  ).length;

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary to-[#0d4550] rounded-2xl p-6 text-white">
        <p className="text-white/60 text-sm font-medium">Welcome back,</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mt-0.5">{displayName} 👋</h1>
        <p className="mt-2 text-white/60 text-sm">Here&apos;s a summary of your account activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders",  value: totalOrders,    icon: Package,      color: "text-primary",  bg: "bg-primary/10" },
          { label: "Active Orders", value: pendingCount,   icon: Clock,        color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Delivered",     value: deliveredCount, icon: CheckCircle,  color: "text-green-600", bg: "bg-green-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-5">Your order history will appear here</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    {" · "}
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: "/products",         label: "Browse Products",  desc: "Explore our full catalogue",         icon: Package },
          { href: "/account/profile",  label: "Edit Profile",     desc: "Update your name and phone number",   icon: Truck },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 bg-white rounded-2xl border border-border p-5 shadow-sm hover:border-primary/30 hover:shadow-[0_4px_24px_-4px_rgba(11,58,66,0.12)] transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
