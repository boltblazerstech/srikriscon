package com.ecommerce.backend.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    /** Optional — if provided, the variant price is used instead of the base product price. */
    private Long variantId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
