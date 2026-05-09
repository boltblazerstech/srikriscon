package com.ecommerce.backend.admin.controller;

import com.ecommerce.backend.admin.dto.AdminUserRequest;
import com.ecommerce.backend.admin.dto.AdminUserResponse;
import com.ecommerce.backend.admin.service.AdminUserService;
import com.ecommerce.backend.auth.entity.AdminUser;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
@Tag(name = "Admin - User Management")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "List all admin users (paginated)")
    public ApiResponse<PagedResponse<AdminUserResponse>> list(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(adminUserService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get admin user by ID")
    public ApiResponse<AdminUserResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(adminUserService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new admin user")
    public ApiResponse<AdminUserResponse> create(@Valid @RequestBody AdminUserRequest req) {
        return ApiResponse.success("Admin user created", adminUserService.create(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an admin user (omit password to keep current)")
    public ApiResponse<AdminUserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserRequest req) {
        return ApiResponse.success("Admin user updated", adminUserService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an admin user (cannot delete yourself)")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal AdminUser currentAdmin) {
        adminUserService.delete(id, currentAdmin.getId());
        return ApiResponse.success("Admin user deleted");
    }
}
