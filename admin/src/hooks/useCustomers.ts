import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { Customer, CustomerRequest, ApiResponse, Page } from "@/src/types";

export function useAdminCustomers() {
  return useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page<Customer>>>(
        "/api/admin/customers"
      );
      return data.data;
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: CustomerRequest;
    }) => {
      const { data } = await api.put<ApiResponse<Customer>>(
        `/api/admin/customers/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/customers/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });
}
