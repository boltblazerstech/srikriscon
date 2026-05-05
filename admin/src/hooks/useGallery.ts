import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, GalleryImage } from "@/src/types";

// Backend: GET /api/gallery  (admin-only, paginated)
export function useGalleryImages() {
  return useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<GalleryImage[]>>(
        "/api/gallery"
      );
      return data.data;
    },
  });
}

// Backend: POST /api/gallery/batch  — register already-uploaded image URLs in the gallery DB
// The gallery page uploads files to /api/upload/batch first, then calls this hook
// to persist the resulting URLs in the gallery table.
// NOTE: This endpoint does not yet exist in the backend. A batch URL-registration
// endpoint needs to be added: POST /api/gallery/batch  body: { images: [{ imageUrl, altText }] }
export function useAddGalleryImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (imageUrls: { imageUrl: string; altText?: string }[]) => {
      const { data } = await api.post<ApiResponse<GalleryImage[]>>(
        "/api/gallery/batch",
        { images: imageUrls }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });
}

// Single-file multipart upload (direct to gallery, when no pre-upload step is used)
// Backend: POST /api/gallery  (multipart/form-data — file, altText, title)
export function useUploadGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      altText,
      title,
    }: {
      file: File;
      altText?: string;
      title?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (altText) formData.append("altText", altText);
      if (title) formData.append("title", title);

      const { data } = await api.post<ApiResponse<GalleryImage>>(
        "/api/gallery",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });
}

// Backend: DELETE /api/gallery/{id}
export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/gallery/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });
}

// Backend: PUT /api/gallery/reorder  — body: { ids: number[] }
export function useReorderGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.put("/api/gallery/reorder", { ids });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });
}
