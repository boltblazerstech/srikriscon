import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, Category, CategoryRequest, Page } from "@/src/types";

// Backend: GET /api/categories/admin  (admin-only, paginated, includes inactive)
export function useAdminCategories(page = 0, size = 50) {
  return useQuery({
    queryKey: ["admin", "categories", { page, size }],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page<Category>>>(
        "/api/categories/admin",
        { params: { page, size } }
      );
      return data.data;
    },
  });
}

// Backend: GET /api/categories  (flat list, no pagination)
export function useAllCategories() {
  return useQuery({
    queryKey: ["admin", "categories", "all"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>(
        "/api/categories"
      );
      return data.data;
    },
    staleTime: 120_000,
  });
}

// Backend: POST /api/categories  (admin-only, requires ADMIN role)
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CategoryRequest) => {
      const { data } = await api.post<ApiResponse<Category>>(
        "/api/categories",
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

// Backend: PUT /api/categories/{id}  (admin-only)
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: CategoryRequest }) => {
      const { data } = await api.put<ApiResponse<Category>>(
        `/api/categories/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

// Backend: DELETE /api/categories/{id}  (admin-only)
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}
