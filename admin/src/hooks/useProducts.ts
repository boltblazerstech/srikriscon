import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, Page, Product, ProductRequest } from "@/src/types";

interface ProductFilters {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number | string;
  active?: boolean;
}

// Backend: GET /api/products/admin  (includes inactive, admin-only)
export function useAdminProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["admin", "products", filters],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page<Product>>>(
        "/api/products/admin",
        { params: { size: 20, ...filters } }
      );
      return data.data;
    },
  });
}

// Backend: GET /api/products/{id}
export function useAdminProduct(id: number | null) {
  return useQuery({
    queryKey: ["admin", "products", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(
        `/api/products/${id}`
      );
      return data.data;
    },
    enabled: id != null,
  });
}

// Backend: POST /api/products
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ProductRequest) => {
      const { data } = await api.post<ApiResponse<Product>>(
        "/api/products",
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// Backend: PUT /api/products/{id}
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: ProductRequest }) => {
      const { data } = await api.put<ApiResponse<Product>>(
        `/api/products/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// Backend: DELETE /api/products/{id}
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// Backend: PATCH /api/products/{id}/active  — toggles active status
export function useToggleProductActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const { data } = await api.patch<ApiResponse<Product>>(
        `/api/products/${id}/active`,
        null,
        { params: { active } }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}
