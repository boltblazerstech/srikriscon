"use client";

import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import StatsCard from "@/src/components/ui/StatsCard";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import { OrderStatusBadge, PaymentStatusBadge } from "@/src/components/ui/Badge";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { useDashboardStats } from "@/src/hooks/useDashboard";
import { formatPrice, formatDateTime } from "@/src/lib/utils";
import { ShoppingCart, DollarSign, Package, Tag, Users, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
} from "recharts";
import type { Order } from "@/src/types";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PLACED:     "#4f46e5",
  CONFIRMED:  "#4f46e5",
  PROCESSING: "#d97706",
  SHIPPED:    "#0284c7",
  DELIVERED:  "#16a34a",
  CANCELLED:  "#dc2626",
  REFUNDED:   "#6b7280",
};

const RECENT_COLS: Column<Order>[] = [
  {
    key: "orderNumber",
    header: "Order",
    cell: (o) => (
      <Link href={`/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">
        {o.orderNumber}
      </Link>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (o) => (
      <div className="text-xs">
        <p className="font-medium text-foreground">{o.shippingName}</p>
        <p className="text-muted-foreground">{o.customerEmail}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: "paymentStatus",
    header: "Payment",
    cell: (o) => <PaymentStatusBadge status={o.paymentStatus} />,
  },
  {
    key: "totalAmount",
    header: "Total",
    cell: (o) => <span className="font-semibold text-sm">{formatPrice(o.totalAmount)}</span>,
  },
  {
    key: "createdAt",
    header: "Date",
    cell: (o) => <span className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</span>,
  },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const chartData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count]) => ({ status, count }))
    : [];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader title="Dashboard" description="Store overview and recent activity" />

        {isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Revenue"
                value={formatPrice(stats.revenuePaid)}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatsCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                icon={<ShoppingCart className="h-4 w-4" />}
              />
              <StatsCard
                title="Products"
                value={stats.totalProducts.toLocaleString()}
                icon={<Package className="h-4 w-4" />}
              />
              <StatsCard
                title="Categories"
                value={stats.totalCategories.toLocaleString()}
                icon={<Tag className="h-4 w-4" />}
              />
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Users className="h-4 w-4" /> Total Customers
                </div>
                <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-success mt-1">+{stats.newCustomersToday} today</p>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <DollarSign className="h-4 w-4" /> Total Revenue (all)
                </div>
                <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="bg-surface rounded-xl border border-warning-light p-4">
                <div className="flex items-center gap-2 text-warning text-sm mb-1">
                  <AlertTriangle className="h-4 w-4" /> Low Stock Products
                </div>
                <p className="text-2xl font-bold text-warning">{stats.lowStockProducts}</p>
                <p className="text-xs text-muted-foreground mt-1">Quantity = 0</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="xl:col-span-2 bg-surface rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Orders by Status</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] ?? "var(--color-primary)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status counts */}
              <div className="xl:col-span-3 bg-surface rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Status Breakdown</h2>
                <div className="grid grid-cols-2 gap-3">
                  {chartData.map(({ status, count }) => (
                    <div
                      key={status}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ background: STATUS_COLORS[status] ?? "#4f46e5" }}
                        />
                        <span className="text-xs text-foreground font-medium">{status}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
                <Link href="/orders" className="text-xs text-primary hover:underline">
                  View all →
                </Link>
              </div>
              <DataTable
                columns={RECENT_COLS}
                data={stats.recentOrders}
                rowKey={(o) => o.id}
              />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
