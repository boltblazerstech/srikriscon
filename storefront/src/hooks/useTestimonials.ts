"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { Testimonial } from "@/src/types";

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () =>
      api.get<Testimonial[]>("/api/cms/testimonials").then((r) => r.data),
    staleTime: 10 * 60_000,
  });
}
