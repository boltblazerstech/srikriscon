"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { Banner } from "@/src/types";

export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: () => api.get<Banner[]>("/api/cms/banners").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}
