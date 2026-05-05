package com.ecommerce.backend.cms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TestimonialRequest {

    @NotBlank
    private String name;

    private String designation;

    private String company;

    @NotBlank
    private String content;

    @Min(1) @Max(5)
    private int rating = 5;

    private String imageUrl;

    private int sortOrder;

    private boolean active = true;
}
