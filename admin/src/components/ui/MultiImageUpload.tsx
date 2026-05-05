"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Upload, X, GripVertical, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import api from "@/src/config/api";
import { cn } from "@/src/lib/utils";
import type { UploadResponse } from "@/src/types";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  error?: string;
  maxFiles?: number;
  className?: string;
}

export default function MultiImageUpload({
  value,
  onChange,
  folder = "uploads",
  label,
  error,
  maxFiles = 10,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const remaining = maxFiles - value.length;
      const files = accepted.slice(0, remaining);
      if (files.length === 0) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        files.forEach((f) => form.append("files", f));
        form.append("folder", folder);
        const { data } = await api.post<{ data: UploadResponse[] }>(
          "/api/upload/batch",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const newUrls = data.data.map((r) => r.url);
        onChange([...value, ...newUrls]);
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, maxFiles, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles,
    maxSize: 10 * 1024 * 1024,
    disabled: value.length >= maxFiles,
  });

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(value);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items);
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          <span className="text-muted-foreground font-normal ml-1">
            ({value.length}/{maxFiles})
          </span>
        </label>
      )}

      {/* Image grid with drag-to-reorder */}
      {value.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3 mb-3"
              >
                {value.map((url, i) => (
                  <Draggable key={url} draggableId={url} index={i}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={cn(
                          "relative h-24 w-24 rounded-lg overflow-hidden border border-border group flex-shrink-0",
                          snapshot.isDragging && "ring-2 ring-primary shadow-lg"
                        )}
                      >
                        <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />

                        {/* Drag handle */}
                        <div
                          {...dragProvided.dragHandleProps}
                          className="absolute top-1 left-1 h-5 w-5 rounded bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab"
                        >
                          <GripVertical className="h-3 w-3" />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-fg flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        {/* Index badge */}
                        <div className="absolute bottom-1 left-1 h-4 min-w-4 px-1 rounded bg-black/50 text-white text-xs flex items-center justify-center">
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

      {/* Dropzone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 py-8",
            isDragActive
              ? "border-primary bg-primary-light"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            {uploading ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : isDragActive ? (
              <Upload className="h-5 w-5 text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground font-medium">
              {uploading ? "Uploading…" : isDragActive ? "Drop images here" : "Add images"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Up to {maxFiles - value.length} more · PNG, JPG, WebP
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
