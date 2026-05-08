package com.ecommerce.backend.category.controller;

import com.ecommerce.backend.category.dto.CategoryRequest;
import com.ecommerce.backend.category.dto.CategoryResponse;
import com.ecommerce.backend.category.service.CategoryService;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "List all active categories (flat)")
    public ApiResponse<List<CategoryResponse>> list() {
        return ApiResponse.success(categoryService.findAll());
    }

    @GetMapping("/admin")
    @Operation(summary = "Admin: paginated list of all categories (incl. inactive)")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<PagedResponse<CategoryResponse>> listAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.success(categoryService.findAllPaged(page, size));
    }

    @GetMapping("/tree")
    @Operation(summary = "Category tree (roots with children)")
    public ApiResponse<List<CategoryResponse>> tree() {
        return ApiResponse.success(categoryService.findRoots());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(categoryService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<CategoryResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(categoryService.findBySlug(slug));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<CategoryResponse> create(@Valid @RequestBody CategoryRequest req) {
        return ApiResponse.success("Category created", categoryService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<CategoryResponse> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return ApiResponse.success("Category updated", categoryService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.success("Category deleted");
    }
}
