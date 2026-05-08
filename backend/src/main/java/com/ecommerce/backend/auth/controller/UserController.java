package com.ecommerce.backend.auth.controller;

import com.ecommerce.backend.auth.dto.ChangePasswordRequest;
import com.ecommerce.backend.auth.dto.UpdateProfileRequest;
import com.ecommerce.backend.auth.dto.UserProfileResponse;
import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.auth.repository.UserRepository;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Authenticated user profile management")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get the current user's profile")
    public ApiResponse<UserProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ApiResponse.success(UserProfileResponse.from(user));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update the current user's profile (name / phone)")
    public ApiResponse<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest req) {

        if (req.getFirstName() != null) user.setFirstName(req.getFirstName().isBlank() ? null : req.getFirstName().trim());
        if (req.getLastName()  != null) user.setLastName(req.getLastName().isBlank()   ? null : req.getLastName().trim());
        if (req.getPhone()     != null) user.setPhone(req.getPhone().isBlank()          ? null : req.getPhone().trim());

        User saved = userRepository.save(user);
        return ApiResponse.success("Profile updated successfully", UserProfileResponse.from(saved));
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change the current user's password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest req) {

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ApiResponse.success("Password changed successfully");
    }
}
