package com.ecommerce.backend.cms.dto;

import com.ecommerce.backend.cms.entity.Banner;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BannerResponse {

    private Long id;
    private String title;
    private String subtitle;
    private String imageUrl;
    private String linkUrl;
    private int sortOrder;
    private boolean active;
    private LocalDateTime createdAt;

    public static BannerResponse from(Banner b) {
        return BannerResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .subtitle(b.getSubtitle())
                .imageUrl(b.getImageUrl())
                .linkUrl(b.getLinkUrl())
                .sortOrder(b.getSortOrder())
                .active(b.isActive())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
