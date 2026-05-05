"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Switch from "@/src/components/ui/Switch";
import Modal from "@/src/components/ui/Modal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ImageUpload from "@/src/components/ui/ImageUpload";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Badge from "@/src/components/ui/Badge";
import {
  useAdminTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
} from "@/src/hooks/useTestimonials";
import { extractApiError } from "@/src/lib/utils";
import type { Testimonial } from "@/src/types";

const schema = z.object({
  name:      z.string().min(1, "Required"),
  content:   z.string().min(1, "Required"),
  rating:    z.number().int().min(1).max(5),
  imageUrl:  z.string().optional(),
  active:    z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useAdminTestimonials();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const del    = useDeleteTestimonial();

  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const {
    register, handleSubmit, control, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", content: "", rating: 5, imageUrl: "", active: true },
  });

  const rating = watch("rating");

  function openAdd() {
    setEditTarget(null);
    reset({ name: "", content: "", rating: 5, imageUrl: "", active: true });
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditTarget(t);
    reset({
      name: t.name, content: t.content, rating: t.rating,
      imageUrl: t.imageUrl ?? "", active: t.active,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: FormData) {
    try {
      if (editTarget) {
        await update.mutateAsync({ id: editTarget.id, body: data });
        toast.success("Testimonial updated");
      } else {
        await create.mutateAsync(data);
        toast.success("Testimonial created");
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
      toast.success("Testimonial deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  const columns: Column<Testimonial>[] = [
    {
      key: "avatar",
      header: "",
      className: "w-12",
      cell: (t) =>
        t.imageUrl ? (
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-border">
            <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
            {t.name[0]?.toUpperCase()}
          </div>
        ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (t) => (
        <div>
          <p className="font-medium text-sm">{t.name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3 w-3 ${s <= t.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "Review",
      cell: (t) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{t.content}</p>
      ),
    },
    {
      key: "active",
      header: "Status",
      cell: (t) => <Badge variant={t.active ? "success" : "muted"}>{t.active ? "Active" : "Hidden"}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      cell: (t) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(t)}
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
          title="Testimonials"
          description="Customer reviews displayed on the homepage"
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>
              Add Testimonial
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={testimonials ?? []}
          isLoading={isLoading}
          rowKey={(t) => t.id}
          emptyTitle="No testimonials yet"
          emptyAction={{ label: "Add Testimonial", onClick: openAdd }}
        />
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Testimonial" : "Add Testimonial"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Customer Name"
            {...register("name")}
            error={errors.name?.message}
          />

          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("rating", s)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      s <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-destructive mt-1">{errors.rating.message}</p>
            )}
          </div>

          <Textarea
            label="Review"
            {...register("content")}
            error={errors.content?.message}
            rows={3}
          />

          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUpload
                label="Customer Photo (optional)"
                value={field.value || undefined}
                onChange={(url) => field.onChange(url ?? "")}
                folder="testimonials"
                aspectRatio="aspect-square"
              />
            )}
          />

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} label="Visible on site" />
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
        title="Delete Testimonial"
        description={`Delete review by "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
