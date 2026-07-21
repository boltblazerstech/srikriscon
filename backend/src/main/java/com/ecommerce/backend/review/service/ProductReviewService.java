package com.ecommerce.backend.review.service;

import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.order.repository.OrderRepository;
import com.ecommerce.backend.product.entity.Product;
import com.ecommerce.backend.product.repository.ProductRepository;
import com.ecommerce.backend.review.dto.ReviewRequest;
import com.ecommerce.backend.review.dto.ReviewResponse;
import com.ecommerce.backend.review.dto.ReviewStatsResponse;
import com.ecommerce.backend.review.entity.ProductReview;
import com.ecommerce.backend.review.entity.ProductReview.ReviewStatus;
import com.ecommerce.backend.review.repository.ProductReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public ReviewResponse createReview(Long productId, ReviewRequest req, User currentUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Long userId = currentUser != null ? currentUser.getId() : null;
        String email = currentUser != null ? currentUser.getEmail() : req.getReviewerEmail();
        String name = currentUser != null
                ? (currentUser.getFirstName() + " " + (currentUser.getLastName() != null ? currentUser.getLastName() : "")).trim()
                : (req.getReviewerName() != null && !req.getReviewerName().isBlank() ? req.getReviewerName() : "Customer");

        boolean verified = false;
        if (userId != null || email != null) {
            verified = orderRepository.existsPurchasedItem(userId, email, productId);
        }

        ProductReview review = ProductReview.builder()
                .product(product)
                .user(currentUser)
                .reviewerName(name)
                .reviewerEmail(email)
                .rating(req.getRating())
                .title(req.getTitle())
                .comment(req.getComment())
                .verifiedPurchase(verified)
                .status(ReviewStatus.APPROVED) // Auto-approve or configure via admin
                .build();

        return ReviewResponse.from(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        Page<ProductReview> page = reviewRepository.findByProductIdAndStatus(productId, ReviewStatus.APPROVED, pageable);
        return PagedResponse.of(page, ReviewResponse::from);
    }

    @Transactional(readOnly = true)
    public ReviewStatsResponse getProductReviewStats(Long productId) {
        Double avg = reviewRepository.findAverageRatingByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        long total = reviewRepository.countByProductIdAndStatus(productId, ReviewStatus.APPROVED);

        List<Object[]> breakdownList = reviewRepository.countRatingBreakdownByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        Map<Integer, Long> breakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            breakdown.put(i, 0L);
        }
        for (Object[] row : breakdownList) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            if (rating != null) {
                breakdown.put(rating, count);
            }
        }

        return ReviewStatsResponse.builder()
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalReviews(total)
                .ratingBreakdown(breakdown)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> searchAdminReviews(String search, ReviewStatus status, Pageable pageable) {
        String pattern = "%" + (search != null ? search.trim() : "") + "%";
        Page<ProductReview> page = reviewRepository.searchAdmin(status, pattern, pageable);
        return PagedResponse.of(page, ReviewResponse::from);
    }

    @Transactional
    public ReviewResponse updateReviewStatus(Long id, ReviewStatus status) {
        ProductReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        review.setStatus(status);
        return ReviewResponse.from(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id) {
        ProductReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        reviewRepository.delete(review);
    }
}
