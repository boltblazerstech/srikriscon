package com.ecommerce.backend.cms.controller;

import com.ecommerce.backend.cms.dto.BannerRequest;
import com.ecommerce.backend.cms.dto.BannerResponse;
import com.ecommerce.backend.cms.dto.ReorderRequest;
import com.ecommerce.backend.cms.service.BannerService;
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
@RequestMapping("/api/cms/banners")
@RequiredArgsConstructor
@Tag(name = "CMS - Banners")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    @Operation(summary = "List active banners (public)")
    public ApiResponse<List<BannerResponse>> listActive() {
        return ApiResponse.success(bannerService.findActive());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: list all banners")
    public ApiResponse<List<BannerResponse>> listAll() {
        return ApiResponse.success(bannerService.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: create banner")
    public ApiResponse<BannerResponse> create(@Valid @RequestBody BannerRequest req) {
        return ApiResponse.success("Banner created", bannerService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update banner")
    public ApiResponse<BannerResponse> update(@PathVariable Long id, @Valid @RequestBody BannerRequest req) {
        return ApiResponse.success("Banner updated", bannerService.update(id, req));
    }

    @PutMapping("/reorder")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: reorder banners — pass ordered list of IDs")
    public ApiResponse<Void> reorder(@Valid @RequestBody ReorderRequest req) {
        bannerService.reorder(req.getIds());
        return ApiResponse.success("Banners reordered");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: delete banner")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        bannerService.delete(id);
        return ApiResponse.success("Banner deleted");
    }
}
