package com.ecommerce.backend.review.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ReviewStatsResponse {
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> ratingBreakdown;
}
