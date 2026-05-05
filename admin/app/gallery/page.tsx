"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  DragDropContext, Droppable, Draggable, type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Trash2, Upload, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/src/config/api";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {
  useGalleryImages, useAddGalleryImages, useDeleteGalleryImage, useReorderGallery,
} from "@/src/hooks/useGallery";
import { cn, extractApiError } from "@/src/lib/utils";
import type { GalleryImage, UploadResponse } from "@/src/types";

export default function GalleryPage() {
  const { data: images, isLoading } = useGalleryImages();
  const addImages   = useAddGalleryImages();
  const deleteImage = useDeleteGalleryImage();
  const reorder     = useReorderGallery();

  const [uploadModal, setUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [localOrder, setLocalOrder]   = useState<GalleryImage[] | null>(null);

  const displayed = localOrder ?? images ?? [];

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(displayed);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setLocalOrder(items);
    reorder.mutate(
      items.map((img) => img.id),
      {
        onError: (err) => {
          toast.error(extractApiError(err));
          setLocalOrder(null);
        },
        onSuccess: () => setLocalOrder(null),
      }
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteImage.mutateAsync(deleteTarget.id);
      toast.success("Image deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Gallery"
          description="Manage site images — drag to reorder"
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => setUploadModal(true)}>
              Upload Images
            </Button>
          }
        />

        {isLoading && (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        )}

        {!isLoading && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-sm">No images yet.</p>
            <Button
              className="mt-4"
              icon={<Upload className="h-4 w-4" />}
              onClick={() => setUploadModal(true)}
            >
              Upload first images
            </Button>
          </div>
        )}

        {displayed.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-3"
                >
                  {displayed.map((img, i) => (
                    <Draggable
                      key={img.id.toString()}
                      draggableId={img.id.toString()}
                      index={i}
                    >
                      {(dragProvided, snapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={cn(
                            "relative h-40 w-40 rounded-xl overflow-hidden border border-border group bg-muted flex-shrink-0",
                            snapshot.isDragging && "ring-2 ring-primary shadow-xl"
                          )}
                        >
                          <Image
                            src={img.url}
                            alt={img.altText ?? ""}
                            fill
                            className="object-cover"
                          />

                          {/* Drag handle */}
                          <div
                            {...dragProvided.dragHandleProps}
                            className="absolute top-1.5 left-1.5 h-6 w-6 rounded-lg bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-3.5 w-3.5" />
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(img)}
                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-destructive text-destructive-fg flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          {/* Order badge */}
                          <div className="absolute bottom-1.5 left-1.5 h-5 min-w-5 px-1 rounded bg-black/50 text-white text-xs font-medium flex items-center justify-center">
                            {i + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        title="Upload Gallery Images"
        size="md"
      >
        <UploadDropzone
          onUploaded={async (urls) => {
            try {
              await addImages.mutateAsync(urls.map((url) => ({ imageUrl: url })));
              toast.success(`${urls.length} image(s) added`);
              setUploadModal(false);
            } catch (err) {
              toast.error(extractApiError(err));
            }
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        description="Remove this image from the gallery?"
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}

function UploadDropzone({ onUploaded }: { onUploaded: (urls: string[]) => Promise<void> }) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews]   = useState<string[]>([]);

  const onDrop = useCallback(async (accepted: File[]) => {
    if (accepted.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      accepted.forEach((f) => form.append("files", f));
      form.append("folder", "gallery");
      const { data } = await api.post<{ data: UploadResponse[] }>(
        "/api/upload/batch",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const urls = data.data.map((r) => r.url);
      setPreviews(urls);
      await onUploaded(urls);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 py-12",
        isDragActive ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Uploading…</p>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop images here" : "Upload Gallery Images"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Up to 10 images · PNG, JPG, WebP · Max 10MB each
            </p>
          </div>
        </>
      )}
    </div>
  );
}
