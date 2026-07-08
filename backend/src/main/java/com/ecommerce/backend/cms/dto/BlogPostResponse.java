package com.ecommerce.backend.cms.dto;

import com.ecommerce.backend.cms.entity.BlogPost;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlogPostResponse {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String category;
    private String author;
    private String imageUrl;
    private String readTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BlogPostResponse from(BlogPost post) {
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .excerpt(post.getExcerpt())
                .content(post.getContent())
                .category(post.getCategory())
                .author(post.getAuthor())
                .imageUrl(post.getImageUrl())
                .readTime(post.getReadTime())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
