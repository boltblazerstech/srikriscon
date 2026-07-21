"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { PagedResponse } from "@/src/types";

export interface Review {
  id: string | number;
  productId: number;
  productName?: string;
  userId?: number;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  status?: string;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  comment: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

export function useProductReviews(productId?: number, page = 0, size = 10) {
  return useQuery<PagedResponse<Review>>({
    queryKey: ["reviews", "product", productId, page],
    queryFn: () =>
      api
        .get<PagedResponse<Review>>(`/api/products/${productId}/reviews`, {
          params: { page, size },
        })
        .then((r) => r.data),
    enabled: productId != null,
    staleTime: 30_000,
  });
}

export function useProductReviewStats(productId?: number) {
  return useQuery<ReviewStats>({
    queryKey: ["reviews", "stats", productId],
    queryFn: () =>
      api
        .get<ReviewStats>(`/api/products/${productId}/reviews/stats`)
        .then((r) => r.data),
    enabled: productId != null,
    staleTime: 30_000,
  });
}

export function useCreateReview(productId?: number) {
  const qc = useQueryClient();
  return useMutation<Review, Error, CreateReviewPayload>({
    mutationFn: (payload) =>
      api
        .post<Review>(`/api/products/${productId}/reviews`, payload)
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", "product", productId] });
      qc.invalidateQueries({ queryKey: ["reviews", "stats", productId] });
    },
  });
}
