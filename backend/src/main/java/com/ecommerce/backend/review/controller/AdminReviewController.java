package com.ecommerce.backend.review.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.review.dto.ReviewResponse;
import com.ecommerce.backend.review.entity.ProductReview.ReviewStatus;
import com.ecommerce.backend.review.service.ProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminReviewController {

    private final ProductReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getAdminReviews(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ReviewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<ReviewResponse> result = reviewService.searchAdminReviews(search, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Admin reviews retrieved successfully", result));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status
    ) {
        ReviewResponse updated = reviewService.updateReviewStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Review status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }
}
