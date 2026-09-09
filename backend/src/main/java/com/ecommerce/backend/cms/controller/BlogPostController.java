package com.ecommerce.backend.cms.controller;

import com.ecommerce.backend.cms.dto.BlogPostRequest;
import com.ecommerce.backend.cms.dto.BlogPostResponse;
import com.ecommerce.backend.cms.service.BlogPostService;
import com.ecommerce.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@Tag(name = "CMS - Blogs")
public class BlogPostController {

    private final BlogPostService blogPostService;

    @GetMapping
    @Operation(summary = "List all blog posts (public)")
    public ApiResponse<List<BlogPostResponse>> listAll() {
        return ApiResponse.success(blogPostService.findAll());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get a blog post by its slug (public)")
    public ApiResponse<BlogPostResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(blogPostService.findBySlug(slug));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a blog post by ID")
    public ApiResponse<BlogPostResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(blogPostService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: create a blog post")
    public ApiResponse<BlogPostResponse> create(@Valid @RequestBody BlogPostRequest req) {
        return ApiResponse.success("Blog post created successfully", blogPostService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update a blog post")
    public ApiResponse<BlogPostResponse> update(@PathVariable Long id, @Valid @RequestBody BlogPostRequest req) {
        return ApiResponse.success("Blog post updated successfully", blogPostService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: delete a blog post")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        blogPostService.delete(id);
        return ApiResponse.success("Blog post deleted successfully");
    }
}
