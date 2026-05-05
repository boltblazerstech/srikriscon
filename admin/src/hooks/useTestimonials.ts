import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, Testimonial, TestimonialRequest } from "@/src/types";

// Backend: GET /api/cms/testimonials/all  (admin-only — includes inactive)
export function useAdminTestimonials() {
  return useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Testimonial[]>>(
        "/api/cms/testimonials/all"
      );
      return data.data;
    },
  });
}

// Backend: POST /api/cms/testimonials
export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: TestimonialRequest) => {
      const { data } = await api.post<ApiResponse<Testimonial>>(
        "/api/cms/testimonials",
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}

// Backend: PUT /api/cms/testimonials/{id}
export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TestimonialRequest;
    }) => {
      const { data } = await api.put<ApiResponse<Testimonial>>(
        `/api/cms/testimonials/${id}`,
        body
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}

// Backend: DELETE /api/cms/testimonials/{id}
export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/cms/testimonials/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}

// Backend: PUT /api/cms/testimonials/reorder  — body: { ids: number[] }
export function useReorderTestimonials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.put("/api/cms/testimonials/reorder", { ids });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}
