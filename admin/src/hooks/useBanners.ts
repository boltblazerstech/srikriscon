import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, Banner, BannerRequest } from "@/src/types";

// Backend: GET /api/cms/banners/all  (admin-only — includes inactive banners)
export function useAdminBanners() {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Banner[]>>(
        "/api/cms/banners/all"
      );
      return data.data;
    },
  });
}

// Backend: POST /api/cms/banners
export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BannerRequest) => {
      const { data } = await api.post<ApiResponse<Banner>>(
        "/api/cms/banners",
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });
}

// Backend: PUT /api/cms/banners/{id}
export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: BannerRequest }) => {
      const { data } = await api.put<ApiResponse<Banner>>(
        `/api/cms/banners/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });
}

// Backend: DELETE /api/cms/banners/{id}
export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/cms/banners/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });
}

// Backend: PUT /api/cms/banners/reorder  — body: { ids: number[] }
export function useReorderBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.put("/api/cms/banners/reorder", { ids });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });
}
