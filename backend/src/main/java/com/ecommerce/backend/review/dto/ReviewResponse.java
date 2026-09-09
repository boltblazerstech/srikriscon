package com.ecommerce.backend.review.dto;

import com.ecommerce.backend.review.entity.ProductReview;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String reviewerName;
    private String reviewerEmail;
    private int rating;
    private String title;
    private String comment;
    private boolean verifiedPurchase;
    private String status;
    private LocalDateTime createdAt;

    public static ReviewResponse from(ProductReview review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct() != null ? review.getProduct().getId() : null)
                .productName(review.getProduct() != null ? review.getProduct().getName() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .reviewerName(review.getReviewerName())
                .reviewerEmail(review.getReviewerEmail())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .verifiedPurchase(review.isVerifiedPurchase())
                .status(review.getStatus() != null ? review.getStatus().name() : "APPROVED")
                .createdAt(review.getCreatedAt())
                .build();
    }
}
