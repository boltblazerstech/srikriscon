package com.ecommerce.backend.common.controller;

import com.ecommerce.backend.common.response.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAuthController {
    @GetMapping("/api/test-auth")
    public ApiResponse<Object> testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ApiResponse.success("No Auth", null);
        return ApiResponse.success("Auth found", auth.getAuthorities());
    }
}
