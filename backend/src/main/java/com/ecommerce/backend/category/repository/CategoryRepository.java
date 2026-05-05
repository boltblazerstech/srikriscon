package com.ecommerce.backend.category.repository;

import com.ecommerce.backend.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Category> findByParentIsNullAndActiveTrueOrderBySortOrderAsc();

    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.sortOrder ASC")
    List<Category> findAllActive();
}
