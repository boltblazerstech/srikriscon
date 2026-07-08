package com.ecommerce.backend.product.dto;

import com.ecommerce.backend.product.entity.ProductVariant.VariantType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductVariantRequest {

    private Long id;

    @NotNull(message = "Variant type is required (SIZE, DESIGN, MATERIAL)")
    private VariantType type;

    @NotBlank(message = "Variant value is required")
    private String value;

    @DecimalMin(value = "0.00", message = "Price must be >= 0")
    private BigDecimal price;

    private int stockQuantity = 0;
    private boolean active = true;
    private int sortOrder = 0;
}
