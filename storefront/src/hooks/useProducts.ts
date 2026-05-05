"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { Product, PagedResponse } from "@/src/types";

interface ProductListParams {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  categorySlug?: string;
  search?: string;
}

export function useProducts(params: ProductListParams = {}) {
  const { page = 0, size = 12, sort, categoryId, categorySlug, search } = params;

  return useQuery<PagedResponse<Product>>({
    queryKey: ["products", { page, size, sort, categoryId, categorySlug, search }],
    queryFn: () =>
      api
        .get<PagedResponse<Product>>("/api/products", {
          params: {
            page,
            size,
            ...(sort && { sort }),
            ...(categoryId && { categoryId }),
            ...(categorySlug && { category: categorySlug }),
            ...(search && { q: search }),
          },
        })
        .then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: () =>
      api
        .get<PagedResponse<Product>>("/api/products/featured")
        .then((r) => r.data.content),
    staleTime: 60_000,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ["products", slug],
    queryFn: () =>
      api.get<Product>(`/api/products/slug/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}
