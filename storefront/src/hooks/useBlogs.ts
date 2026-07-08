"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { BlogPost } from "@/src/config/blogs";

export function useBlogs() {
  return useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: () =>
      api.get<BlogPost[]>("/api/blogs").then((r) => r.data),
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
