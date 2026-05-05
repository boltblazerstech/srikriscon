package com.ecommerce.backend.product.service;

import com.ecommerce.backend.category.entity.Category;
import com.ecommerce.backend.category.repository.CategoryRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ConflictException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.product.dto.ImageRequest;
import com.ecommerce.backend.product.dto.ProductRequest;
import com.ecommerce.backend.product.dto.ProductResponse;
import com.ecommerce.backend.product.dto.ProductVariantRequest;
import com.ecommerce.backend.product.entity.Product;
import com.ecommerce.backend.product.entity.ProductImage;
import com.ecommerce.backend.product.entity.ProductVariant;
import com.ecommerce.backend.product.repository.ProductImageRepository;
import com.ecommerce.backend.product.repository.ProductRepository;
import com.ecommerce.backend.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository imageRepository;
    private final ProductVariantRepository variantRepository;
    private final CategoryRepository categoryRepository;

    // ─── Public listing endpoints ─────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> findAll(Pageable pageable) {
        return PagedResponse.of(productRepository.findByActiveTrueAndDeletedAtIsNull(pageable), ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> findByCategory(Long categoryId, Pageable pageable) {
        return PagedResponse.of(
                productRepository.findByCategoryIdAndActiveTrueAndDeletedAtIsNull(categoryId, pageable),
                ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> search(String query, Pageable pageable) {
        return PagedResponse.of(productRepository.search(query, pageable), ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> findFeatured(Pageable pageable) {
        return PagedResponse.of(
                productRepository.findByFeaturedTrueAndActiveTrueAndDeletedAtIsNull(pageable),
                ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse findBySlug(String slug) {
        return ProductResponse.from(productRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug)));
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(getOrThrow(id));
    }

    // ─── Admin listing ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> findAllAdmin(Pageable pageable) {
        return PagedResponse.of(productRepository.findByDeletedAtIsNull(pageable), ProductResponse::from);
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    @Transactional
    public ProductResponse create(ProductRequest req) {
        String slug = resolveUniqueSlug(req.getSlug(), req.getName(), null);
        if (req.getSku() != null && productRepository.existsBySkuAndDeletedAtIsNull(req.getSku())) {
            throw new ConflictException("SKU already in use: " + req.getSku());
        }
        Product p = applyRequest(Product.builder().slug(slug).build(), req);
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = getOrThrow(id);
        String slug = resolveUniqueSlug(req.getSlug(), req.getName(), id);
        if (req.getSku() != null && !req.getSku().equals(p.getSku())
                && productRepository.existsBySkuAndIdNotAndDeletedAtIsNull(req.getSku(), id)) {
            throw new ConflictException("SKU already in use: " + req.getSku());
        }
        p.setSlug(slug);
        return ProductResponse.from(productRepository.save(applyRequest(p, req)));
    }

    @Transactional
    public void delete(Long id) {
        Product p = getOrThrow(id);
        p.setDeletedAt(LocalDateTime.now());
        p.setActive(false);
        productRepository.save(p);
    }

    // ─── Image management ─────────────────────────────────────────────────────

    @Transactional
    public ProductResponse addImage(Long productId, ImageRequest req) {
        Product p = getOrThrow(productId);
        ProductImage img = ProductImage.builder()
                .product(p)
                .url(req.getUrl())
                .altText(req.getAltText())
                .sortOrder(req.getSortOrder())
                .primary(req.isPrimary())
                .build();
        if (req.isPrimary()) {
            p.getImages().forEach(i -> i.setPrimary(false));
        }
        p.getImages().add(img);
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse removeImage(Long productId, Long imageId) {
        Product p = getOrThrow(productId);
        boolean removed = p.getImages().removeIf(i -> i.getId().equals(imageId));
        if (!removed) {
            throw new ResourceNotFoundException("Image", imageId);
        }
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse setPrimaryImage(Long productId, Long imageId) {
        Product p = getOrThrow(productId);
        boolean found = false;
        for (ProductImage img : p.getImages()) {
            if (img.getId().equals(imageId)) {
                img.setPrimary(true);
                found = true;
            } else {
                img.setPrimary(false);
            }
        }
        if (!found) {
            throw new ResourceNotFoundException("Image", imageId);
        }
        return ProductResponse.from(productRepository.save(p));
    }

    // ─── Variant management ───────────────────────────────────────────────────

    @Transactional
    public ProductResponse addVariant(Long productId, ProductVariantRequest req) {
        Product p = getOrThrow(productId);
        ProductVariant v = ProductVariant.builder()
                .product(p)
                .type(req.getType())
                .value(req.getValue())
                .price(req.getPrice())
                .stockQuantity(req.getStockQuantity())
                .active(req.isActive())
                .sortOrder(req.getSortOrder())
                .build();
        p.getVariants().add(v);
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse updateVariant(Long productId, Long variantId, ProductVariantRequest req) {
        ProductVariant v = variantRepository.findByIdAndProductId(variantId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant", variantId));
        v.setType(req.getType());
        v.setValue(req.getValue());
        v.setPrice(req.getPrice());
        v.setStockQuantity(req.getStockQuantity());
        v.setActive(req.isActive());
        v.setSortOrder(req.getSortOrder());
        variantRepository.save(v);
        return ProductResponse.from(getOrThrow(productId));
    }

    @Transactional
    public ProductResponse deleteVariant(Long productId, Long variantId) {
        Product p = getOrThrow(productId);
        boolean removed = p.getVariants().removeIf(v -> v.getId().equals(variantId));
        if (!removed) {
            throw new ResourceNotFoundException("Variant", variantId);
        }
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse.VariantDto> listVariants(Long productId) {
        getOrThrow(productId); // ensure product exists
        return variantRepository.findByProductIdOrderBySortOrderAsc(productId).stream()
                .map(ProductResponse.VariantDto::of)
                .toList();
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    private Product applyRequest(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setShortDescription(req.getShortDescription());
        p.setPrice(req.getPrice());
        p.setComparePrice(req.getComparePrice());
        p.setCostPrice(req.getCostPrice());
        p.setSku(req.getSku());
        p.setStockQuantity(req.getStockQuantity());
        p.setLowStockThreshold(req.getLowStockThreshold());
        p.setMinOrderQty(req.getMinOrderQty());
        p.setWeight(req.getWeight());
        p.setActive(req.isActive());
        p.setFeatured(req.isFeatured());
        p.setSortOrder(req.getSortOrder());
        p.setMetaTitle(req.getMetaTitle());
        p.setMetaDescription(req.getMetaDescription());

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", req.getCategoryId()));
            p.setCategory(cat);
        } else {
            p.setCategory(null);
        }
        return p;
    }

    private Product getOrThrow(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        if (p.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Product", id);
        }
        return p;
    }

    /**
     * Returns req.slug if provided, otherwise generates one from name.
     * Ensures uniqueness among non-deleted products (excluding excludeId for
     * updates).
     */
    private String resolveUniqueSlug(String requestedSlug, String name, Long excludeId) {
        String base = (requestedSlug != null && !requestedSlug.isBlank())
                ? requestedSlug.trim().toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-{2,}", "-")
                        .replaceAll("(^-|-$)", "")
                : name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").trim().replaceAll("\\s+", "-");

        String candidate = base;
        int counter = 2;
        while (isSlugTaken(candidate, excludeId)) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }

    private boolean isSlugTaken(String slug, Long excludeId) {
        return excludeId == null
                ? productRepository.existsBySlugAndDeletedAtIsNull(slug)
                : productRepository.existsBySlugAndIdNotAndDeletedAtIsNull(slug, excludeId);
    }

    /**
     * Convenience: slug auto-generation with no conflict possible (used by
     * BadRequestException check).
     */
    @Transactional(readOnly = true)
    public void validateSlug(String slug) {
        if (slug != null && !slug.matches("^[a-z0-9][a-z0-9-]*[a-z0-9]$")) {
            throw new BadRequestException("Slug must be lowercase alphanumeric with hyphens, e.g. 'my-product'");
        }
    }
}
