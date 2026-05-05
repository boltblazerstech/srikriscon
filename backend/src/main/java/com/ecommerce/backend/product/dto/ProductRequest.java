package com.ecommerce.backend.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Name is required")
    private String name;

    // Optional — auto-generated from name if omitted
    private String slug;

    private String description;
    private String shortDescription;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be >= 0")
    private BigDecimal price;

    private BigDecimal comparePrice;
    private BigDecimal costPrice;
    private String sku;

    @Min(value = 0, message = "Stock quantity must be >= 0")
    private int stockQuantity = 0;

    @Min(value = 0, message = "Low stock threshold must be >= 0")
    private int lowStockThreshold = 5;

    @Min(value = 1, message = "Min order quantity must be >= 1")
    private int minOrderQty = 1;

    private BigDecimal weight;
    private Long categoryId;
    private boolean active = true;
    private boolean featured = false;
    private int sortOrder = 0;
    private String metaTitle;
    private String metaDescription;
}
