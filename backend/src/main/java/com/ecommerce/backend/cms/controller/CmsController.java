package com.ecommerce.backend.cms.controller;

import com.ecommerce.backend.cms.dto.CmsPageRequest;
import com.ecommerce.backend.cms.dto.CmsPageResponse;
import com.ecommerce.backend.cms.service.CmsService;
import com.ecommerce.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cms")
@RequiredArgsConstructor
@Tag(name = "CMS")
public class CmsController {

    private final CmsService cmsService;

    @GetMapping
    public ApiResponse<List<CmsPageResponse>> listPublished() {
        return ApiResponse.success(cmsService.findPublished());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ApiResponse<List<CmsPageResponse>> listAll() {
        return ApiResponse.success(cmsService.findAll());
    }

    @GetMapping("/admin/{slug}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ApiResponse<CmsPageResponse> getAdminBySlug(@PathVariable String slug) {
        return ApiResponse.success(cmsService.findBySlug(slug));
    }

    @GetMapping("/{slug}")
    public ApiResponse<CmsPageResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.success(cmsService.findPublishedBySlug(slug));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ApiResponse<CmsPageResponse> create(@Valid @RequestBody CmsPageRequest req) {
        return ApiResponse.success("Page created", cmsService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ApiResponse<CmsPageResponse> update(@PathVariable Long id, @Valid @RequestBody CmsPageRequest req) {
        return ApiResponse.success("Page updated", cmsService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        cmsService.delete(id);
        return ApiResponse.success("Page deleted");
    }
}
