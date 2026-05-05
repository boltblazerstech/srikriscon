"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { Category } from "@/src/types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () =>
      api.get<Category[]>("/api/categories").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

export function useCategory(slug: string) {
  return useQuery<Category>({
    queryKey: ["categories", slug],
    queryFn: () =>
      api.get<Category>(`/api/categories/slug/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
}
