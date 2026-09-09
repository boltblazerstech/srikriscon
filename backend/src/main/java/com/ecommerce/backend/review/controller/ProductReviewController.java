package com.ecommerce.backend.review.controller;

import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.review.dto.ReviewRequest;
import com.ecommerce.backend.review.dto.ReviewResponse;
import com.ecommerce.backend.review.dto.ReviewStatsResponse;
import com.ecommerce.backend.review.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<ReviewResponse> result = reviewService.getProductReviews(productId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", result));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ReviewStatsResponse>> getProductReviewStats(@PathVariable Long productId) {
        ReviewStatsResponse stats = reviewService.getProductReviewStats(productId);
        return ResponseEntity.ok(ApiResponse.success("Review stats retrieved successfully", stats));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        ReviewResponse created = reviewService.createReview(productId, req, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", created));
    }
}
