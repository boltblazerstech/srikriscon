package com.ecommerce.backend.category.dto;

import com.ecommerce.backend.category.entity.Category;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Long parentId;
    private String parentName;
    private boolean active;
    private int sortOrder;
    private List<CategoryResponse> children;

    public static CategoryResponse from(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .parentName(c.getParent() != null ? c.getParent().getName() : null)
                .active(c.isActive())
                .sortOrder(c.getSortOrder())
                .build();
    }

    public static CategoryResponse fromWithChildren(Category c) {
        CategoryResponse resp = from(c);
        resp.setChildren(c.getChildren().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList()));
        return resp;
    }
}
