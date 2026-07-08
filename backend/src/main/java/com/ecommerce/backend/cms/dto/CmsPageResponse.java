package com.ecommerce.backend.cms.dto;

import com.ecommerce.backend.cms.entity.CmsPage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CmsPageResponse {

    private Long id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String status;
    private boolean active;
    private String metaTitle;
    private String metaDescription;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CmsPageResponse from(CmsPage p) {
        return CmsPageResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .content(p.getContent())
                .excerpt(p.getExcerpt())
                .status(p.getStatus().name())
                .active(p.getStatus() == CmsPage.Status.PUBLISHED)
                .metaTitle(p.getMetaTitle())
                .metaDescription(p.getMetaDescription())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
