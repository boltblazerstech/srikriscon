"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import api from "@/src/config/api";
import { cn } from "@/src/lib/utils";
import type { UploadResponse } from "@/src/types";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  label?: string;
  error?: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label,
  error,
  className,
  aspectRatio = "aspect-video",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        const { data } = await api.post<{ data: UploadResponse }>(
          "/api/upload",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        onChange(data.data.url);
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className={cn("relative rounded-xl overflow-hidden border border-border group", aspectRatio)}>
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="h-8 w-8 rounded-full bg-destructive text-destructive-fg flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 p-8",
            aspectRatio,
            isDragActive
              ? "border-primary bg-primary-light"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            error && "border-destructive"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs">Uploading…</span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                {isDragActive ? (
                  <Upload className="h-5 w-5 text-primary" />
                ) : (
                  <ImageIcon className="h-5 w-5" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-foreground font-medium">
                  {isDragActive ? "Drop image here" : "Upload image"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drag & drop or click · PNG, JPG, WebP · Max 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
