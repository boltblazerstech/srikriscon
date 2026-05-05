"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { GalleryImage, PagedResponse } from "@/src/types";

export function useGallery(page = 0, size = 50) {
  return useQuery<PagedResponse<GalleryImage>>({
    queryKey: ["gallery", page, size],
    queryFn: () =>
      api
        .get<PagedResponse<GalleryImage>>("/api/gallery", {
          params: { page, size },
        })
        .then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}
