package com.ecommerce.backend.order.controller;

import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.order.dto.OrderRequest;
import com.ecommerce.backend.order.dto.OrderResponse;
import com.ecommerce.backend.order.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders")
public class OrderController {

    private final OrderService orderService;

    // ─── Customer endpoints ───────────────────────────────────────────────────

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Place a new order")
    public ApiResponse<OrderResponse> place(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrderRequest req) {
        return ApiResponse.success("Order placed successfully", orderService.placeOrder(user, req));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List current customer's orders")
    public ApiResponse<PagedResponse<OrderResponse>> myOrders(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.success(orderService.findByUser(user.getId(), pageable));
    }

    @GetMapping("/my/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get a specific order (must belong to current customer)")
    public ApiResponse<OrderResponse> getMyOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ApiResponse.success(orderService.findByIdForUser(id, user));
    }

    @PostMapping("/my/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an order (only when status is PLACED)")
    public ApiResponse<OrderResponse> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ApiResponse.success("Order cancelled", orderService.cancelByCustomer(id, user));
    }

    // ─── Admin endpoints ──────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: list all orders; filter by ?status=PLACED and ?search=query")
    public ApiResponse<PagedResponse<OrderResponse>> all(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.success(orderService.findAllAdmin(status, search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: get order by ID")
    public ApiResponse<OrderResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(orderService.findById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: update order status")
    public ApiResponse<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ApiResponse.success("Status updated", orderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: cancel any non-delivered order")
    public ApiResponse<OrderResponse> adminCancel(@PathVariable Long id) {
        return ApiResponse.success("Order cancelled", orderService.cancelByAdmin(id));
    }

    @PatchMapping("/{id}/mark-paid")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: mark order as paid manually")
    public ApiResponse<OrderResponse> markPaid(@PathVariable Long id) {
        return ApiResponse.success("Order marked as paid", orderService.markPaidManually(id));
    }
}
