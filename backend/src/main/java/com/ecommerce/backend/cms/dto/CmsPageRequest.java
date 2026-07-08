package com.ecommerce.backend.cms.dto;

import com.ecommerce.backend.cms.entity.CmsPage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CmsPageRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String content;
    private String excerpt;
    private CmsPage.Status status = CmsPage.Status.DRAFT;
    private Boolean active;
    private String metaTitle;
    private String metaDescription;
}
