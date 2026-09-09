"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Pencil, Trash2, Users } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Switch from "@/src/components/ui/Switch";
import Modal from "@/src/components/ui/Modal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Badge from "@/src/components/ui/Badge";
import {
  useAdminCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/src/hooks/useCustomers";
import { extractApiError, getInitials, formatDate } from "@/src/lib/utils";
import type { Customer } from "@/src/types";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  email:     z.string().email("Invalid email address"),
  phone:     z.string().optional().or(z.literal("")),
  active:    z.boolean(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const { data: customersPage, isLoading } = useAdminCustomers();
  const update = useUpdateCustomer();
  const del    = useDeleteCustomer();

  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName:  "",
      email:     "",
      phone:     "",
      active:    true,
    },
  });

  function openEdit(c: Customer) {
    setEditTarget(c);
    reset({
      firstName: c.firstName || "",
      lastName:  c.lastName || "",
      email:     c.email || "",
      phone:     c.phone || "",
      active:    c.active,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: CustomerFormData) {
    if (!editTarget) return;
    try {
      await update.mutateAsync({
        id: editTarget.id,
        body: {
          ...data,
          phone: data.phone?.trim() || undefined,
        },
      });
      toast.success("Customer profile updated successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await del.mutateAsync(deleteTarget.id);
      toast.success("Customer account deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  const columns: Column<Customer>[] = [
    {
      key: "avatar",
      header: "",
      className: "w-12",
      cell: (c) => (
        <div className="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
          {getInitials(`${c.firstName || ""} ${c.lastName || ""}`)}
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (c) => (
        <span className="font-medium text-sm text-foreground">
          {c.firstName} {c.lastName}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (c) => <span className="text-sm text-muted-foreground">{c.email}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (c) => <span className="text-sm text-muted-foreground">{c.phone || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => (
        <Badge variant={c.active ? "success" : "muted"}>
          {c.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: "Joined On",
      cell: (c) => <span className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      cell: (c) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(c)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader
          title="Customers"
          description="Manage storefront customer accounts"
        />

        <DataTable
          columns={columns}
          data={customersPage?.content ?? []}
          isLoading={isLoading}
          rowKey={(c) => c.id}
          emptyTitle="No customers found"
        />
      </div>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Customer Profile"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            type="number"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Account Active"
              />
            )}
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer Account"
        description={`Delete customer account "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This will permanently delete their account and history.`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
