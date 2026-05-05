"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Switch from "@/src/components/ui/Switch";
import Modal from "@/src/components/ui/Modal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ImageUpload from "@/src/components/ui/ImageUpload";
import Badge from "@/src/components/ui/Badge";
import Pagination from "@/src/components/ui/Pagination";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/src/hooks/useCategories";
import { slugify, extractApiError } from "@/src/lib/utils";
import type { Category } from "@/src/types";

const schema = z.object({
  name:        z.string().min(1, "Required"),
  slug:        z.string().min(1, "Required"),
  description: z.string().optional(),
  imageUrl:    z.string().optional(),
  active:      z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function CategoriesPage() {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading } = useAdminCategories(page);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del    = useDeleteCategory();

  const {
    register, handleSubmit, control, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", imageUrl: "", active: true },
  });

  const nameVal = watch("name");
  useEffect(() => {
    if (!editTarget) setValue("slug", slugify(nameVal ?? ""));
  }, [nameVal, editTarget, setValue]);

  function openAdd() {
    setEditTarget(null);
    reset({ name: "", slug: "", description: "", imageUrl: "", active: true });
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      imageUrl: cat.imageUrl ?? "",
      active: cat.active,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: FormData) {
    try {
      if (editTarget) {
        await update.mutateAsync({ id: editTarget.id, body: data });
        toast.success("Category updated");
      } else {
        await create.mutateAsync(data);
        toast.success("Category created");
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
      toast.success("Category deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  const columns: Column<Category>[] = [
    {
      key: "image",
      header: "Image",
      cell: (c) =>
        c.imageUrl ? (
          <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No img
          </div>
        ),
    },
    {
      key: "name",
      header: "Name",
      cell: (c) => (
        <div>
          <p className="font-medium text-sm">{c.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{c.slug}</p>
        </div>
      ),
    },
    {
      key: "active",
      header: "Status",
      cell: (c) => (
        <Badge variant={c.active ? "success" : "muted"}>
          {c.active ? "Active" : "Inactive"}
        </Badge>
      ),
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
          title="Categories"
          description="Organise your product catalogue"
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>
              Add Category
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={data?.content ?? []}
          isLoading={isLoading}
          rowKey={(c) => c.id}
          emptyTitle="No categories yet"
          emptyAction={{ label: "Add Category", onClick: openAdd }}
        />

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register("name")} error={errors.name?.message} />
          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            hint="URL-friendly identifier"
          />
          <Textarea label="Description (optional)" {...register("description")} rows={3} />

          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUpload
                label="Category Image"
                value={field.value || undefined}
                onChange={(url) => field.onChange(url ?? "")}
                folder="categories"
                aspectRatio="aspect-video"
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
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editTarget ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? Products in this category will become uncategorised.`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
