package com.ecommerce.backend.category.service;

import com.ecommerce.backend.category.dto.CategoryRequest;
import com.ecommerce.backend.category.dto.CategoryResponse;
import com.ecommerce.backend.category.entity.Category;
import com.ecommerce.backend.category.repository.CategoryRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ConflictException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAllActive().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findRoots() {
        return categoryRepository.findByParentIsNullAndActiveTrueOrderBySortOrderAsc().stream()
                .map(CategoryResponse::fromWithChildren)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse findBySlug(String slug) {
        Category cat = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return CategoryResponse.fromWithChildren(cat);
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return CategoryResponse.fromWithChildren(getOrThrow(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        String slug = resolveUniqueSlug(req.getSlug(), req.getName(), null);
        Category cat = Category.builder()
                .name(req.getName())
                .slug(slug)
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .active(req.isActive())
                .sortOrder(req.getSortOrder())
                .build();

        if (req.getParentId() != null) {
            cat.setParent(getOrThrow(req.getParentId()));
        }
        return CategoryResponse.from(categoryRepository.save(cat));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category cat = getOrThrow(id);

        if (req.getParentId() != null && req.getParentId().equals(id)) {
            throw new BadRequestException("A category cannot be its own parent");
        }

        String slug = resolveUniqueSlug(req.getSlug(), req.getName(), id);
        cat.setName(req.getName());
        cat.setSlug(slug);
        cat.setDescription(req.getDescription());
        cat.setImageUrl(req.getImageUrl());
        cat.setActive(req.isActive());
        cat.setSortOrder(req.getSortOrder());
        cat.setParent(req.getParentId() != null ? getOrThrow(req.getParentId()) : null);

        return CategoryResponse.from(categoryRepository.save(cat));
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.delete(getOrThrow(id));
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    private Category getOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    /**
     * Returns req.slug if provided; otherwise generates one from name.
     * Ensures uniqueness (excluding current record on updates).
     */
    private String resolveUniqueSlug(String requestedSlug, String name, Long excludeId) {
        String base = (requestedSlug != null && !requestedSlug.isBlank())
                ? requestedSlug.trim().toLowerCase()
                        .replaceAll("[^a-z0-9-]", "-").replaceAll("-{2,}", "-").replaceAll("(^-|-$)", "")
                : name.toLowerCase()
                        .replaceAll("[^a-z0-9\\s]", "").trim().replaceAll("\\s+", "-");

        String candidate = base;
        int counter = 2;
        while (isSlugTaken(candidate, excludeId)) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }

    private boolean isSlugTaken(String slug, Long excludeId) {
        if (!categoryRepository.existsBySlug(slug)) return false;
        if (excludeId == null) return true;
        return categoryRepository.findBySlug(slug)
                .map(c -> !c.getId().equals(excludeId))
                .orElse(false);
    }
}
