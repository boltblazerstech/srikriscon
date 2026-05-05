package com.ecommerce.backend.cms.dto;

import com.ecommerce.backend.cms.entity.Testimonial;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TestimonialResponse {

    private Long id;
    private String name;
    private String designation;
    private String company;
    private String content;
    private int rating;
    private String imageUrl;
    private int sortOrder;
    private boolean active;
    private LocalDateTime createdAt;

    public static TestimonialResponse from(Testimonial t) {
        return TestimonialResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .designation(t.getDesignation())
                .company(t.getCompany())
                .content(t.getContent())
                .rating(t.getRating())
                .imageUrl(t.getImageUrl())
                .sortOrder(t.getSortOrder())
                .active(t.isActive())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
