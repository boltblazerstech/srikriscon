import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { AdminUser, AdminUserRequest, ApiResponse, Page } from "@/src/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page<AdminUser>>>(
        "/api/admin/users"
      );
      return data.data;
    },
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AdminUserRequest) => {
      const { data } = await api.post<ApiResponse<AdminUser>>(
        "/api/admin/users",
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: Partial<AdminUserRequest>;
    }) => {
      const { data } = await api.put<ApiResponse<AdminUser>>(
        `/api/admin/users/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/users/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
