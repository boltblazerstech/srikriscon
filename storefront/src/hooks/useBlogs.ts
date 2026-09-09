"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { BlogPost } from "@/src/config/blogs";

interface BlogsParams {
  size?: number;
  page?: number;
  category?: string;
}

interface BlogsResponse {
  content: BlogPost[];
  totalElements: number;
  totalPages: number;
}

export function useBlogs(params?: BlogsParams) {
  const queryParams = new URLSearchParams();
  if (params?.size)     queryParams.set("size",     String(params.size));
  if (params?.page)     queryParams.set("page",     String(params.page));
  if (params?.category) queryParams.set("category", params.category);

  const queryString = queryParams.toString();

  return useQuery<BlogsResponse>({
    queryKey: ["blogs", params],
    queryFn: async () => {
      const url = `/api/blogs${queryString ? `?${queryString}` : ""}`;
      const res = await api.get<BlogsResponse | BlogPost[]>(url);
      const data = res.data;
      // Handle both paginated { content: [...] } and plain array response
      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length, totalPages: 1 };
      }
      return data as BlogsResponse;
    },
    staleTime: 5 * 60_000,
  });
}

export function useBlog(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ["blogs", slug],
    queryFn: () =>
      api.get<BlogPost>(`/api/blogs/slug/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
}
