package com.ecommerce.backend.admin.controller;

import com.ecommerce.backend.admin.dto.CustomerRequest;
import com.ecommerce.backend.admin.dto.CustomerResponse;
import com.ecommerce.backend.admin.service.AdminCustomerService;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin Customers", description = "Admin actions to manage storefront customers")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    @GetMapping
    @Operation(summary = "List all customer accounts (paginated)")
    public ApiResponse<PagedResponse<CustomerResponse>> list(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(adminCustomerService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed customer profile")
    public ApiResponse<CustomerResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(adminCustomerService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit customer profile details")
    public ApiResponse<CustomerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest req) {
        return ApiResponse.success("Customer profile updated", adminCustomerService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer account")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminCustomerService.delete(id);
        return ApiResponse.success("Customer account deleted");
    }
}
