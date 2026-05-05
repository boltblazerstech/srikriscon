"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type {
  Order,
  OrderRequest,
  PagedResponse,
  ServiceabilityResponse,
  ShipmentResponse,
} from "@/src/types";

export function useMyOrders(page = 0, size = 10) {
  return useQuery<PagedResponse<Order>>({
    queryKey: ["orders", "my", page],
    queryFn: () =>
      api
        .get<PagedResponse<Order>>("/api/orders/my", { params: { page, size } })
        .then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useMyOrder(id: number | null) {
  return useQuery<Order>({
    queryKey: ["orders", "my", id],
    queryFn: () =>
      api.get<Order>(`/api/orders/my/${id}`).then((r) => r.data),
    enabled: id != null,
    staleTime: 30_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, OrderRequest>({
    mutationFn: (req) =>
      api.post<Order>("/api/orders", req).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, number>({
    mutationFn: (id) =>
      api.post<Order>(`/api/orders/my/${id}/cancel`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useCheckServiceability(pincode: string) {
  return useQuery<ServiceabilityResponse>({
    queryKey: ["serviceability", pincode],
    queryFn: () =>
      api
        .get<ServiceabilityResponse>("/api/delivery/serviceability", {
          params: { pincode },
        })
        .then((r) => r.data),
    enabled: pincode.length === 6,
    staleTime: 10 * 60_000,
    retry: false,
  });
}

export function useTrackOrder(orderId: number | null) {
  return useQuery<ShipmentResponse>({
    queryKey: ["track", orderId],
    queryFn: () =>
      api
        .get<ShipmentResponse>(`/api/delivery/orders/${orderId}/track`)
        .then((r) => r.data),
    enabled: orderId != null,
    staleTime: 60_000,
    retry: false,
  });
}
