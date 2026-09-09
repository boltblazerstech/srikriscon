import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { BlogPost, BlogPostRequest, ApiResponse } from "@/src/types";

export function useAdminBlogs() {
  return useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost[]>>("/api/blogs");
      return data.data;
    },
  });
}

export function useAdminBlog(id: number) {
  return useQuery({
    queryKey: ["admin", "blogs", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost>>(`/api/blogs/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BlogPostRequest) => {
      const { data } = await api.post<ApiResponse<BlogPost>>("/api/blogs", body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blogs"] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: BlogPostRequest;
    }) => {
      const { data } = await api.put<ApiResponse<BlogPost>>(`/api/blogs/${id}`, body);
      return data.data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin", "blogs"] });
      qc.invalidateQueries({ queryKey: ["admin", "blogs", variables.id] });
    },
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/blogs/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blogs"] }),
  });
}
