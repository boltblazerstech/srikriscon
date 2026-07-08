package com.ecommerce.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogPostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String category;

    private String author;

    private String imageUrl;

    private String readTime;
}
