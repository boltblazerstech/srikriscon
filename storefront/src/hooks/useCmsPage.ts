"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { CmsPage } from "@/src/types";

export function useCmsPage(slug: string) {
  return useQuery<CmsPage>({
    queryKey: ["cms", slug],
    queryFn: () => api.get<CmsPage>(`/api/cms/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    staleTime: 10 * 60_000,
    retry: false,
  });
}
