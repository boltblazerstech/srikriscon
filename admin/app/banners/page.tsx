"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Switch from "@/src/components/ui/Switch";
import Modal from "@/src/components/ui/Modal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ImageUpload from "@/src/components/ui/ImageUpload";
import DragDropList from "@/src/components/ui/DragDropList";
import Badge from "@/src/components/ui/Badge";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import {
  useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useReorderBanners,
} from "@/src/hooks/useBanners";
import { extractApiError } from "@/src/lib/utils";
import type { Banner } from "@/src/types";

const schema = z.object({
  title:      z.string().min(1, "Required"),
  subtitle:   z.string().optional(),
  imageUrl:   z.string().min(1, "Image is required"),
  linkUrl:    z.string().optional(),
  active:     z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function BannersPage() {
  const { data: banners, isLoading } = useAdminBanners();
  const create  = useCreateBanner();
  const update  = useUpdateBanner();
  const del     = useDeleteBanner();
  const reorder = useReorderBanners();

  const [localOrder, setLocalOrder] = useState<Banner[] | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const displayed = localOrder ?? banners ?? [];

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", subtitle: "", imageUrl: "", linkUrl: "", active: true },
  });

  function openAdd() {
    setEditTarget(null);
    reset({ title: "", subtitle: "", imageUrl: "", linkUrl: "", active: true });
    setModalOpen(true);
  }

  function openEdit(b: Banner) {
    setEditTarget(b);
    reset({
      title: b.title, subtitle: b.subtitle ?? "", imageUrl: b.imageUrl,
      linkUrl: b.linkUrl ?? "", active: b.active,
    });
    setModalOpen(true);
  }

  function handleDragEnd(newItems: Banner[]) {
    setLocalOrder(newItems);
    reorder.mutate(
      newItems.map((b) => b.id),
      {
        onError: (err) => { toast.error(extractApiError(err)); setLocalOrder(null); },
        onSuccess: () => setLocalOrder(null),
      }
    );
  }

  async function onSubmit(data: FormData) {
    try {
      if (editTarget) {
        await update.mutateAsync({ id: editTarget.id, body: data });
        toast.success("Banner updated");
      } else {
        await create.mutateAsync(data);
        toast.success("Banner created");
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
      toast.success("Banner deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title="Banners"
          description="Hero banners shown on the homepage — drag to reorder"
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>
              Add Banner
            </Button>
          }
        />

        {isLoading && <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}

        {!isLoading && displayed.length > 0 && (
          <DragDropList
            items={displayed}
            keyExtractor={(b) => b.id.toString()}
            onReorder={handleDragEnd}
            renderItem={(b) => (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {b.imageUrl && (
                  <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>}
                  {b.linkUrl && (
                    <a
                      href={b.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" /> {b.linkUrl}
                    </a>
                  )}
                </div>
                <Badge variant={b.active ? "success" : "muted"}>
                  {b.active ? "Active" : "Off"}
                </Badge>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(b)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          />
        )}

        {!isLoading && displayed.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No banners yet.{" "}
            <button onClick={openAdd} className="text-primary hover:underline">Add one.</button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Banner" : "Add Banner"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register("title")} error={errors.title?.message} />
          <Input label="Subtitle (optional)" {...register("subtitle")} />

          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUpload
                label="Banner Image"
                value={field.value || undefined}
                onChange={(url) => field.onChange(url ?? "")}
                folder="banners"
                aspectRatio="aspect-video"
              />
            )}
          />
          {errors.imageUrl && <p className="text-xs text-destructive -mt-2">{errors.imageUrl.message}</p>}

          <div className="grid grid-cols-1 gap-3">
            <Input label="Link URL (optional)" {...register("linkUrl")} placeholder="https://..." />
          </div>

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
        title="Delete Banner"
        description={`Delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
