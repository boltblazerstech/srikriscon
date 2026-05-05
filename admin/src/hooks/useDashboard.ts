import { useQuery } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, DashboardStats } from "@/src/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      // Backend: GET /api/dashboard/stats
      const { data } = await api.get<ApiResponse<DashboardStats>>(
        "/api/dashboard/stats"
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}
