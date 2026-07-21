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
           "LOWER(r.reviewerName) LIKE LOWER(:search) OR " +
           "LOWER(r.comment) LIKE LOWER(:search) OR " +
           "LOWER(r.product.name) LIKE LOWER(:search)" +
           ")")
    Page<ProductReview> searchAdmin(@Param("status") ReviewStatus status, @Param("search") String search, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId AND r.status = :status")
    Double findAverageRatingByProductIdAndStatus(@Param("productId") Long productId, @Param("status") ReviewStatus status);

    long countByProductIdAndStatus(Long productId, ReviewStatus status);

    @Query("SELECT r.rating, COUNT(r) FROM ProductReview r WHERE r.product.id = :productId AND r.status = :status GROUP BY r.rating")
    List<Object[]> countRatingBreakdownByProductIdAndStatus(@Param("productId") Long productId, @Param("status") ReviewStatus status);
}
