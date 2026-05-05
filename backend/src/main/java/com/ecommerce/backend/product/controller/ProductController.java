package com.ecommerce.backend.product.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.product.dto.ImageRequest;
import com.ecommerce.backend.product.dto.ProductRequest;
import com.ecommerce.backend.product.dto.ProductResponse;
import com.ecommerce.backend.product.dto.ProductVariantRequest;
import com.ecommerce.backend.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {

    private final ProductService productService;

    // ─── Public endpoints ─────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List active products (paginated); filter by ?categoryId or ?q")
    public ApiResponse<PagedResponse<ProductResponse>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20) Pageable pageable) {

        if (q != null && !q.isBlank()) {
            return ApiResponse.success(productService.search(q.trim(), pageable));
        }
        if (categoryId != null) {
            return ApiResponse.success(productService.findByCategory(categoryId, pageable));
        }
        return ApiResponse.success(productService.findAll(pageable));
    }

    @GetMapping("/featured")
    @Operation(summary = "Featured products")
    public ApiResponse<PagedResponse<ProductResponse>> featured(@PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(productService.findFeatured(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ApiResponse<ProductResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(productService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product by slug")
    public ApiResponse<ProductResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.findBySlug(slug));
    }

    // ─── Admin: product CRUD ──────────────────────────────────────────────────

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: list all products including inactive (paginated)")
    public ApiResponse<PagedResponse<ProductResponse>> adminList(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(productService.findAllAdmin(pageable));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: create product (slug auto-generated from name if omitted)")
    public ApiResponse<ProductResponse> create(@Valid @RequestBody ProductRequest req) {
        return ApiResponse.success("Product created", productService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update product")
    public ApiResponse<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return ApiResponse.success("Product updated", productService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: soft-delete product")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ApiResponse.success("Product deleted");
    }

    // ─── Admin: image management ──────────────────────────────────────────────

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: add image to product")
    public ApiResponse<ProductResponse> addImage(
            @PathVariable Long id, @Valid @RequestBody ImageRequest req) {
        return ApiResponse.success("Image added", productService.addImage(id, req));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: remove image from product")
    public ApiResponse<ProductResponse> removeImage(@PathVariable Long id, @PathVariable Long imageId) {
        return ApiResponse.success("Image removed", productService.removeImage(id, imageId));
    }

    @PutMapping("/{id}/images/{imageId}/primary")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: set image as primary")
    public ApiResponse<ProductResponse> setPrimary(@PathVariable Long id, @PathVariable Long imageId) {
        return ApiResponse.success("Primary image updated", productService.setPrimaryImage(id, imageId));
    }

    // ─── Admin: variant management ────────────────────────────────────────────

    @GetMapping("/{id}/variants")
    @Operation(summary = "List all variants for a product (including inactive)")
    public ApiResponse<List<ProductResponse.VariantDto>> listVariants(@PathVariable Long id) {
        return ApiResponse.success(productService.listVariants(id));
    }

    @PostMapping("/{id}/variants")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: add variant to product (type: SIZE | DESIGN | MATERIAL)")
    public ApiResponse<ProductResponse> addVariant(
            @PathVariable Long id, @Valid @RequestBody ProductVariantRequest req) {
        return ApiResponse.success("Variant added", productService.addVariant(id, req));
    }

    @PutMapping("/{id}/variants/{variantId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update variant")
    public ApiResponse<ProductResponse> updateVariant(
            @PathVariable Long id, @PathVariable Long variantId,
            @Valid @RequestBody ProductVariantRequest req) {
        return ApiResponse.success("Variant updated", productService.updateVariant(id, variantId, req));
    }

    @DeleteMapping("/{id}/variants/{variantId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: delete variant")
    public ApiResponse<ProductResponse> deleteVariant(@PathVariable Long id, @PathVariable Long variantId) {
        return ApiResponse.success("Variant deleted", productService.deleteVariant(id, variantId));
    }
}
