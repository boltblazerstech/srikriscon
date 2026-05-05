package com.ecommerce.backend.delivery.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.delivery.dto.ServiceabilityResponse;
import com.ecommerce.backend.delivery.dto.ShipmentResponse;
import com.ecommerce.backend.delivery.service.ShiprocketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
@Tag(name = "Delivery")
public class DeliveryController {

    private final ShiprocketService shiprocketService;

    // ─── Public endpoints ─────────────────────────────────────────────────────

    @GetMapping("/serviceability")
    @Operation(summary = "Check if a delivery pincode is serviceable and list available couriers")
    public ApiResponse<ServiceabilityResponse> serviceability(@RequestParam String pincode) {
        return ApiResponse.success(shiprocketService.checkServiceability(pincode));
    }

    @GetMapping("/track/awb/{awbCode}")
    @Operation(summary = "Track a shipment by its AWB code (live status from Shiprocket)")
    public ApiResponse<ShipmentResponse> trackByAwb(@PathVariable String awbCode) {
        return ApiResponse.success(shiprocketService.trackByAwb(awbCode));
    }

    @GetMapping("/orders/{orderId}/track")
    @Operation(summary = "Track shipment for a given order ID")
    public ApiResponse<ShipmentResponse> trackByOrder(@PathVariable Long orderId) {
        return ApiResponse.success(shiprocketService.trackByOrderId(orderId));
    }

    // ─── Admin endpoints ──────────────────────────────────────────────────────

    @PostMapping("/orders/{orderId}/ship")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: create a Shiprocket shipment for a paid order")
    public ApiResponse<ShipmentResponse> createShipment(@PathVariable Long orderId) {
        return ApiResponse.success("Shipment created", shiprocketService.createShipment(orderId));
    }
}
