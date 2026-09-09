"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import Button from "@/src/components/ui/Button";
import Pagination from "@/src/components/ui/Pagination";
import { OrderStatusBadge, PaymentStatusBadge } from "@/src/components/ui/Badge";
import { useAdminOrders } from "@/src/hooks/useOrders";
import { formatPrice, formatDateTime, formatDate } from "@/src/lib/utils";
import type { Order, OrderStatus } from "@/src/types";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...["PLACED","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"].map(
    (s) => ({ value: s, label: s })
  ),
];

const columns: Column<Order>[] = [
  {
    key: "orderNumber",
    header: "Order #",
    cell: (o) => (
      <Link href={`/orders/${o.id}`} className="font-mono text-sm font-medium text-primary hover:underline">
        {o.orderNumber}
      </Link>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (o) => (
      <div className="text-sm">
        <p className="font-medium">{o.shippingName}</p>
        {o.customerEmail && <p className="text-xs text-muted-foreground">{o.customerEmail}</p>}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: "payment",
    header: "Payment",
    cell: (o) => <PaymentStatusBadge status={o.paymentStatus} />,
  },
  {
    key: "items",
    header: "Items",
    cell: (o) => <span className="text-sm text-muted-foreground">{o.items.length}</span>,
  },
  {
    key: "totalAmount",
    header: "Total",
    cell: (o) => <span className="font-semibold text-sm">{formatPrice(o.totalAmount)}</span>,
  },
  {
    key: "createdAt",
    header: "Date",
    cell: (o) => <span className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</span>,
  },
  {
    key: "actions",
    header: "",
    cell: (o) => (
      <Link href={`/orders/${o.id}`}>
        <Button variant="outline" size="sm">View</Button>
      </Link>
    ),
  },
];

export default function OrdersPage() {
  const [page, setPage]           = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState("");

  const { data, isLoading } = useAdminOrders({
    page,
    status: status as OrderStatus || undefined,
    search: search || undefined,
  });

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(0);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader title="Orders" description="View and manage all customer orders" />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <form
            className="flex-1 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(0); }}
          >
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search order number or customer…"
              prefix={<Search className="h-3.5 w-3.5" />}
              suffix={
                searchInput ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null
              }
              className="flex-1"
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(0); }}
            options={STATUS_OPTIONS}
            className="w-48"
          />
        </div>

        <DataTable
          columns={columns}
          data={data?.content ?? []}
          isLoading={isLoading}
          rowKey={(o) => o.id}
          skeletonRows={10}
          emptyTitle="No orders found"
        />

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
