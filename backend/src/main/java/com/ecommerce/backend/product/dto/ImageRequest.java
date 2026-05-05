package com.ecommerce.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImageRequest {

    @NotBlank(message = "Image URL is required")
    private String url;

    private String altText;
    private int sortOrder = 0;
    private boolean primary = false;
}
