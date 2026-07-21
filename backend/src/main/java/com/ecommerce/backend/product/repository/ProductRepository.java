package com.ecommerce.backend.product.repository;

import com.ecommerce.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlugAndDeletedAtIsNull(String slug);
    boolean existsBySlugAndDeletedAtIsNull(String slug);
    boolean existsBySlugAndIdNotAndDeletedAtIsNull(String slug, Long excludeId);
    boolean existsBySkuAndDeletedAtIsNull(String sku);
    boolean existsBySkuAndIdNotAndDeletedAtIsNull(String sku, Long excludeId);

    Page<Product> findByActiveTrueAndDeletedAtIsNull(Pageable pageable);
    Page<Product> findByCategoryIdAndActiveTrueAndDeletedAtIsNull(Long categoryId, Pageable pageable);
    Page<Product> findByCategorySlugAndActiveTrueAndDeletedAtIsNull(String categorySlug, Pageable pageable);
    Page<Product> findByFeaturedTrueAndActiveTrueAndDeletedAtIsNull(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> search(@Param("q") String query, Pageable pageable);

    // Admin view: all non-deleted (active and inactive)
    Page<Product> findByDeletedAtIsNull(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:q IS NULL OR :q = '' OR " +
           " LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> searchAdmin(
            @Param("categoryId") Long categoryId,
            @Param("q") String query,
            Pageable pageable);

    long countByDeletedAtIsNull();
    long countByStockQuantityAndDeletedAtIsNull(int stockQuantity);
}
