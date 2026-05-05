package com.ecommerce.backend.payment.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import com.ecommerce.backend.payment.dto.PaymentInitResponse;
import com.ecommerce.backend.payment.dto.PaymentVerifyRequest;
import com.ecommerce.backend.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate/{orderId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a Razorpay order for the given store order")
    public ApiResponse<PaymentInitResponse> initiate(@PathVariable Long orderId) {
        return ApiResponse.success(paymentService.initiatePayment(orderId));
    }

    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Verify Razorpay payment signature after checkout")
    public ApiResponse<Void> verify(@Valid @RequestBody PaymentVerifyRequest req) {
        paymentService.verifyPayment(req);
        return ApiResponse.success("Payment verified successfully");
    }

    /**
     * Razorpay webhook — intentionally public; signature is verified inside the service.
     * Register this URL in your Razorpay dashboard under Settings > Webhooks.
     */
    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook receiver")
    public ApiResponse<Void> webhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        paymentService.handleWebhook(payload, signature);
        return ApiResponse.success("Webhook processed");
    }

    @PostMapping("/refund/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Admin: trigger a full refund for an order")
    public ApiResponse<Void> refund(@PathVariable Long orderId) {
        paymentService.triggerRefund(orderId);
        return ApiResponse.success("Refund initiated successfully");
    }
}
