package com.ecommerce.backend.admin.dto;

import com.ecommerce.backend.auth.entity.AdminUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminUserRequest {

    @Email
    @NotBlank
    private String email;

    private String password;

    private String firstName;

    private String lastName;

    @NotNull
    private AdminUser.Role role;

    private boolean active = true;
}
