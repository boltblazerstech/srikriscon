import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type {
  ApiResponse,
  Order,
  OrderStatus,
  Page,
} from "@/src/types";

interface OrderFilters {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
}

// Backend: GET /api/orders  (admin-only, lists all orders; ?status= filter supported)
export function useAdminOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Page<Order>>>(
        "/api/orders",
        { params: { size: 20, ...filters } }
      );
      return data.data;
    },
  });
}

// Backend: GET /api/orders/{id}  (admin-only)
export function useAdminOrder(id: number | null) {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order>>(
        `/api/orders/${id}`
      );
      return data.data;
    },
    enabled: id != null,
  });
}

// Backend: PATCH /api/orders/{id}/status?status=SHIPPED  (uses @RequestParam, not body)
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) => {
      const { data } = await api.patch<ApiResponse<Order>>(
        `/api/orders/${id}/status`,
        null,
        { params: { status } }
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders", id] });
    },
  });
}

// Backend: POST /api/orders/{id}/cancel  (admin cancel)
export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.post<ApiResponse<Order>>(
        `/api/orders/${orderId}/cancel`
      );
      return data.data;
    },
    onSuccess: (_, orderId) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders", orderId] });
    },
  });
}

// NOTE: Shipment and Refund endpoints do NOT exist in the backend yet.
// These are placeholders — implement backend endpoints before using them.
export function useCreateShipment() {
  return useMutation({
    mutationFn: async (_params: { orderId: number; body: unknown }) => {
      throw new Error("Shipment endpoint not yet implemented in backend.");
    },
  });
}

export function useRefundOrder() {
  return useMutation({
    mutationFn: async (_orderId: number) => {
      throw new Error("Refund endpoint not yet implemented in backend.");
    },
  });
}
