"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import Switch from "@/src/components/ui/Switch";
import Modal from "@/src/components/ui/Modal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Badge from "@/src/components/ui/Badge";
import {
  useAdminUsers, useCreateAdminUser, useUpdateAdminUser, useDeleteAdminUser,
} from "@/src/hooks/useAdminUsers";
import { useAuth } from "@/src/hooks/useAuth";
import { extractApiError, getInitials } from "@/src/lib/utils";
import type { AdminUser } from "@/src/types";

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const createSchema = z.object({
  username:  z.string().min(3, "Min 3 characters"),
  email:     z.string().email("Invalid email"),
  firstName: z.string().min(1, "Required"),
  lastName:  z.string().min(1, "Required"),
  password:  z.string().min(8, "Min 8 characters"),
  role:      z.enum(["ADMIN", "SUPER_ADMIN"]),
  active:    z.boolean(),
});

const editSchema = z.object({
  username:  z.string().min(3, "Min 3 characters"),
  email:     z.string().email("Invalid email"),
  firstName: z.string().min(1, "Required"),
  lastName:  z.string().min(1, "Required"),
  password:  z.string().min(8, "Min 8 characters if changing").optional().or(z.literal("")),
  role:      z.enum(["ADMIN", "SUPER_ADMIN"]),
  active:    z.boolean(),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData   = z.infer<typeof editSchema>;
type FormData = CreateFormData | EditFormData;

export default function UsersPage() {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const { data: users, isLoading } = useAdminUsers();
  const create = useCreateAdminUser();
  const update = useUpdateAdminUser();
  const del    = useDeleteAdminUser();

  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editTarget ? editSchema : createSchema) as any,
    defaultValues: { username: "", email: "", firstName: "", lastName: "", password: "", role: "ADMIN", active: true },
  });

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">Only Super Admins can manage users.</p>
        </div>
      </AdminLayout>
    );
  }

  function openAdd() {
    setEditTarget(null);
    reset({ username: "", email: "", firstName: "", lastName: "", password: "", role: "ADMIN", active: true });
    setModalOpen(true);
  }

  function openEdit(u: AdminUser) {
    setEditTarget(u);
    reset({
      username: u.username, email: u.email,
      firstName: u.firstName, lastName: u.lastName,
      password: "", role: u.role, active: u.active ?? true,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: FormData) {
    try {
      if (editTarget) {
        const body: Partial<typeof data> = { ...data };
        if (!body.password) delete body.password;
        await update.mutateAsync({ id: editTarget.id, body });
        toast.success("User updated");
      } else {
        await create.mutateAsync(data as CreateFormData);
        toast.success("User created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await del.mutateAsync(deleteTarget.id);
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "avatar",
      header: "",
      className: "w-12",
      cell: (u) => (
        <div className="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
          {getInitials(`${u.firstName} ${u.lastName}`)}
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (u) => (
        <div>
          <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-muted-foreground font-mono">@{u.username}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (u) => <span className="text-sm text-muted-foreground">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <Badge variant={u.role === "SUPER_ADMIN" ? "warning" : "default"}>
          {u.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Badge variant={u.active !== false ? "success" : "muted"}>
          {u.active !== false ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      cell: (u) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {u.id !== currentUser?.id && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteTarget(u)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader
          title="Users"
          description="Manage admin panel access"
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>
              Add User
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={users?.content ?? []}
          isLoading={isLoading}
          rowKey={(u) => u.id}
          emptyTitle="No admin users found"
        />
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit User" : "Add User"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" {...register("firstName")} error={errors.firstName?.message} />
            <Input label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
          </div>
          <Input label="Username" {...register("username")} error={errors.username?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input
            label={editTarget ? "New Password (leave blank to keep current)" : "Password"}
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                label="Role"
                value={field.value}
                onChange={field.onChange}
                options={roleOptions}
                error={(errors as any).role?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} label="Active" />
            )}
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editTarget ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Delete admin user "${deleteTarget?.username}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
