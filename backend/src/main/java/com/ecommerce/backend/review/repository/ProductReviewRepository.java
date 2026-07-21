package com.ecommerce.backend.review.repository;

import com.ecommerce.backend.review.entity.ProductReview;
import com.ecommerce.backend.review.entity.ProductReview.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    Page<ProductReview> findByProductIdAndStatus(Long productId, ReviewStatus status, Pageable pageable);

    Page<ProductReview> findByProductId(Long productId, Pageable pageable);

    @Query("SELECT r FROM ProductReview r WHERE " +
           "(:status IS NULL OR r.status = :status) AND (" +
           ":search IS NULL OR LOWER(r.reviewerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.product.name) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")")
    Page<ProductReview> searchAdmin(@Param("status") ReviewStatus status, @Param("search") String search, Pageable pageable);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM ProductReview r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    long countByProductIdAndStatus(Long productId, ReviewStatus status);

    @Query("SELECT r.rating, COUNT(r) FROM ProductReview r WHERE r.product.id = :productId AND r.status = 'APPROVED' GROUP BY r.rating")
    List<Object[]> countRatingBreakdownByProductId(@Param("productId") Long productId);
}
