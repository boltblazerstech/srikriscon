package com.ecommerce.backend.product.repository;

import com.ecommerce.backend.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductIdOrderBySortOrderAsc(Long productId);
    Optional<ProductVariant> findByIdAndProductId(Long id, Long productId);
    void deleteByProductId(Long productId);
}
