"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowLeft, Truck, CreditCard, MapPin, User, Package } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { OrderStatusBadge, PaymentStatusBadge } from "@/src/components/ui/Badge";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useAdminOrder, useUpdateOrderStatus, useCreateShipment, useRefundOrder, useMarkOrderPaid } from "@/src/hooks/useOrders";
import { formatPrice, formatDateTime, formatDate, extractApiError } from "@/src/lib/utils";
import type { OrderStatus } from "@/src/types";

const ORDER_STATUSES: OrderStatus[] = [
  "PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

const shipmentSchema = z.object({
  awbCode:           z.string().min(1, "AWB code is required"),
  courierName:       z.string().optional(),
  trackingUrl:       z.string().url("Enter a valid URL").optional().or(z.literal("")),
  estimatedDelivery: z.string().optional(),
});
type ShipmentForm = z.infer<typeof shipmentSchema>;

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = Number(id);

  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus  = useUpdateOrderStatus();
  const addShipment   = useCreateShipment();
  const refund        = useRefundOrder();
  const markPaid      = useMarkOrderPaid();

  const [newStatus, setNewStatus]       = useState<OrderStatus | "">("");
  const [refundConfirm, setRefundConfirm] = useState(false);

  async function handleMarkPaid() {
    try {
      await markPaid.mutateAsync(orderId);
      toast.success("Order marked as paid");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<ShipmentForm>({ resolver: zodResolver(shipmentSchema) });

  async function handleStatusUpdate() {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setNewStatus("");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleShipment(data: ShipmentForm) {
    try {
      await addShipment.mutateAsync({ orderId, body: { ...data, trackingUrl: data.trackingUrl || undefined } });
      toast.success("Shipment info saved");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleRefund() {
    try {
      await refund.mutateAsync(orderId);
      toast.success("Refund initiated");
      setRefundConfirm(false);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      </AdminLayout>
    );
  }
  if (!order) return <AdminLayout><p className="p-6 text-muted-foreground">Order not found.</p></AdminLayout>;

  const canRefund = order.paymentStatus === "PAID" && order.status !== "REFUNDED";

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader
          title={order.orderNumber}
          description={`Placed ${formatDateTime(order.createdAt)}`}
          action={
            <Link href="/orders">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Items */}
            <Card title="Items Ordered" icon={<Package className="h-4 w-4" />}>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium text-foreground">{item.productName}</p>
                      {item.variantValue && (
                        <p className="text-xs text-muted-foreground">{item.variantValue}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <Row label="Subtotal"  value={formatPrice(order.subtotal)} />
                <Row label="Shipping"  value={order.shippingAmount === 0 ? "FREE" : formatPrice(order.shippingAmount)} />
                <Row label="Total" value={formatPrice(order.totalAmount)} bold />
              </div>
            </Card>

            {/* Shipment info */}
            <Card title="Shipment Management" icon={<Truck className="h-4 w-4" />}>
              {order.shipment ? (
                <div className="mb-4 rounded-lg bg-muted/40 p-3 text-sm space-y-1">
                  <Row label="AWB Code"   value={order.shipment.awbCode} mono />
                  {order.shipment.courierName && <Row label="Courier" value={order.shipment.courierName} />}
                  {order.shipment.estimatedDelivery && (
                    <Row label="Est. Delivery" value={formatDate(order.shipment.estimatedDelivery)} />
                  )}
                  {order.shipment.trackingUrl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking URL</span>
                      <a
                        href={order.shipment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate max-w-xs"
                      >
                        View →
                      </a>
                    </div>
                  )}
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground mb-3 font-medium">
                {order.shipment ? "Update shipment details:" : "Add shipment details:"}
              </p>
              <form onSubmit={handleSubmit(handleShipment)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="AWB / Tracking Code"
                    {...register("awbCode")}
                    defaultValue={order.shipment?.awbCode}
                    error={errors.awbCode?.message}
                  />
                  <Input
                    label="Courier Name"
                    {...register("courierName")}
                    defaultValue={order.shipment?.courierName}
                    placeholder="e.g. Delhivery"
                  />
                </div>
                <Input
                  label="Tracking URL (optional)"
                  {...register("trackingUrl")}
                  defaultValue={order.shipment?.trackingUrl}
                  placeholder="https://track.delhivery.com/..."
                  error={errors.trackingUrl?.message}
                />
                <Input
                  label="Estimated Delivery"
                  type="date"
                  {...register("estimatedDelivery")}
                  defaultValue={order.shipment?.estimatedDelivery?.split("T")[0]}
                />
                <Button type="submit" loading={isSubmitting} variant="secondary">
                  {order.shipment ? "Update Shipment" : "Save Shipment"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Status */}
            <Card title="Order Status" icon={<Package className="h-4 w-4" />}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current:</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <Select
                value={newStatus}
                onChange={(v) => setNewStatus(v as OrderStatus)}
                options={[
                  { value: "", label: "Select new status…" },
                  ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
                ]}
              />
              <Button
                className="mt-3 w-full"
                variant="primary"
                disabled={!newStatus || updateStatus.isPending}
                loading={updateStatus.isPending}
                onClick={handleStatusUpdate}
              >
                Update Status
              </Button>

              {canRefund && (
                <Button
                  className="mt-2 w-full"
                  variant="destructive"
                  onClick={() => setRefundConfirm(true)}
                >
                  Initiate Refund
                </Button>
              )}
            </Card>

            {/* Payment */}
            <Card title="Payment" icon={<CreditCard className="h-4 w-4" />}>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                {order.razorpayOrderId && (
                  <Row label="Razorpay Order" value={order.razorpayOrderId} mono />
                )}
                {order.razorpayPaymentId && (
                  <Row label="Payment ID" value={order.razorpayPaymentId} mono />
                )}
                {order.paymentStatus === "PENDING" && (
                  <Button
                    className="mt-3 w-full"
                    variant="secondary"
                    loading={markPaid.isPending}
                    onClick={handleMarkPaid}
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            </Card>

            {/* Customer */}
            <Card title="Customer" icon={<User className="h-4 w-4" />}>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingName}</p>
                {order.customerEmail && <p className="text-muted-foreground">{order.customerEmail}</p>}
                {order.shippingPhone && <p className="text-muted-foreground">{order.shippingPhone}</p>}
              </div>
            </Card>

            {/* Delivery address */}
            <Card title="Delivery Address" icon={<MapPin className="h-4 w-4" />}>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} — {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
                <p className="pt-1">{order.shippingPhone}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={refundConfirm}
        onCancel={() => setRefundConfirm(false)}
        onConfirm={handleRefund}
        title="Initiate Refund"
        description="This will mark the order as refunded. Actual payment reversal depends on your payment provider."
        confirmLabel="Refund"
        variant="destructive"
      />
    </AdminLayout>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  mono,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${mono ? "font-mono text-xs" : ""} text-right`}>
        {value}
      </span>
    </div>
  );
}

