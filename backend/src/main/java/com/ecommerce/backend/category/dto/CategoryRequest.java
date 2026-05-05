package com.ecommerce.backend.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    // Optional — auto-generated from name if omitted
    private String slug;

    private String description;
    private String imageUrl;
    private Long parentId;
    private boolean active = true;
    private int sortOrder = 0;
}
