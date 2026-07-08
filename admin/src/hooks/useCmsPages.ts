import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, CmsPage } from "@/src/types";

// Backend: GET /api/cms/all  (admin-only — includes unpublished pages)
export function useCmsPages() {
  return useQuery({
    queryKey: ["admin", "cms-pages"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CmsPage[]>>("/api/cms/all");
      return data.data;
    },
  });
}

// Backend: GET /api/cms/admin/{slug}  (admin-only — fetches by slug, including drafts)
export function useCmsPage(slug: string | null) {
  return useQuery({
    queryKey: ["admin", "cms-pages", slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CmsPage>>(
        `/api/cms/admin/${slug}`
      );
      return data.data;
    },
    enabled: slug != null,
  });
}

// Backend: PUT /api/cms/{id}  (admin-only — update by numeric ID, not slug)
export function useUpdateCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: Partial<CmsPage>;
    }) => {
      const { data } = await api.put<ApiResponse<CmsPage>>(
        `/api/cms/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "cms-pages"] });
    },
  });
}

// Backend: POST /api/cms  (admin-only — create new CMS page)
export function useCreateCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<CmsPage>) => {
      const { data } = await api.post<ApiResponse<CmsPage>>(
        "/api/cms",
        body
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "cms-pages"] });
    },
  });
}

// Backend: DELETE /api/cms/{id}  (admin-only)
export function useDeleteCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/cms/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "cms-pages"] });
    },
  });
}
