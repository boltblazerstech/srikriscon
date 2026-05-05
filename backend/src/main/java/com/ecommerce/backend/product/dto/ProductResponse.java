package com.ecommerce.backend.product.dto;

import com.ecommerce.backend.product.entity.Product;
import com.ecommerce.backend.product.entity.ProductVariant;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private BigDecimal startingPrice;   // min active variant price, or price if no variants
    private String sku;
    private int stockQuantity;
    private int minOrderQty;
    private boolean inStock;
    private Long categoryId;
    private String categoryName;
    private CategoryInfo category;
    private int lowStockThreshold;
    private List<ImageDto> images;
    private List<VariantDto> variants;
    private Map<String, List<VariantDto>> variantsByType;
    private boolean active;
    private boolean featured;
    private int sortOrder;
    private String metaTitle;
    private String metaDescription;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product p) {
        List<VariantDto> variantDtos = p.getVariants().stream()
                .filter(ProductVariant::isActive)
                .sorted(Comparator.comparingInt(ProductVariant::getSortOrder))
                .map(VariantDto::of)
                .collect(Collectors.toList());

        Map<String, List<VariantDto>> byType = variantDtos.stream()
                .collect(Collectors.groupingBy(VariantDto::getType));

        BigDecimal startingPrice = variantDtos.stream()
                .map(VariantDto::getPrice)
                .min(Comparator.naturalOrder())
                .orElse(p.getPrice());

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .shortDescription(p.getShortDescription())
                .price(p.getPrice())
                .comparePrice(p.getComparePrice())
                .startingPrice(startingPrice)
                .sku(p.getSku())
                .stockQuantity(p.getStockQuantity())
                .minOrderQty(p.getMinOrderQty())
                .inStock(p.getStockQuantity() > 0)
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .category(p.getCategory() != null ? CategoryInfo.builder()
                        .id(p.getCategory().getId())
                        .name(p.getCategory().getName())
                        .slug(p.getCategory().getSlug())
                        .build() : null)
                .lowStockThreshold(p.getLowStockThreshold())
                .images(p.getImages().stream()
                        .map(img -> new ImageDto(img.getId(), img.getUrl(), img.getAltText(), img.isPrimary(), img.getSortOrder()))
                        .collect(Collectors.toList()))
                .variants(variantDtos)
                .variantsByType(byType)
                .active(p.isActive())
                .featured(p.isFeatured())
                .sortOrder(p.getSortOrder())
                .metaTitle(p.getMetaTitle())
                .metaDescription(p.getMetaDescription())
                .createdAt(p.getCreatedAt())
                .build();
    }

    @Data
    public static class ImageDto {
        private final Long id;
        private final String url;
        private final String altText;
        private final boolean primary;
        private final int sortOrder;
    }

    @Data
    @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
    }

    @Data
    @Builder
    public static class VariantDto {
        private Long id;
        private String type;
        private String value;
        private BigDecimal price;
        private int stockQuantity;
        private boolean active;
        private int sortOrder;

        public static VariantDto of(ProductVariant v) {
            return VariantDto.builder()
                    .id(v.getId())
                    .type(v.getType().name())
                    .value(v.getValue())
                    .price(v.getPrice())
                    .stockQuantity(v.getStockQuantity())
                    .active(v.isActive())
                    .sortOrder(v.getSortOrder())
                    .build();
        }
    }
}
