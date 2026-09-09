package com.ecommerce.backend.auth.controller;

import com.ecommerce.backend.auth.dto.*;
import com.ecommerce.backend.auth.service.AuthService;
import com.ecommerce.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication — customers and admins")
public class AuthController {

    private final AuthService authService;

    // ─── Customer auth ────────────────────────────────────────────────────────

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new customer account")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ApiResponse.success("Account created successfully", authService.register(req));
    }

    @PostMapping("/login")
    @Operation(summary = "Customer login — returns JWT access + refresh tokens")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.success(authService.login(req));
    }

    // ─── Admin auth ───────────────────────────────────────────────────────────

    @PostMapping("/admin/login")
    @Operation(summary = "Admin login (ADMIN / SUPER_ADMIN) — returns JWT tokens")
    public ApiResponse<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.success(authService.loginAdmin(req));
    }

    // ─── Token management ─────────────────────────────────────────────────────

    @PostMapping("/refresh")
    @Operation(summary = "Exchange a valid refresh token for a new token pair")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        return ApiResponse.success(authService.refresh(req));
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalidate the supplied refresh token")
    public ApiResponse<Void> logout(@Valid @RequestBody RefreshRequest req) {
        authService.logout(req.getRefreshToken());
        return ApiResponse.success("Logged out successfully");
    }

    // ─── Password reset ───────────────────────────────────────────────────────

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset link sent to the email")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return ApiResponse.success("Password reset link has been sent to your email address");
    }

    @GetMapping("/validate-reset-token")
    @Operation(summary = "Check whether a password-reset token is still valid (non-destructive)")
    public ApiResponse<Void> validateResetToken(@RequestParam String token) {
        authService.validateResetToken(token);
        return ApiResponse.success("Token is valid");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using the token received by email")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ApiResponse.success("Password has been reset — please log in with your new password");
    }
}
