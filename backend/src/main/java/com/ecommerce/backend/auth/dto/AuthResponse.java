package com.ecommerce.backend.auth.dto;

import com.ecommerce.backend.auth.entity.AdminUser;
import com.ecommerce.backend.auth.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long   expiresIn;   // seconds

    private Long   userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public static AuthResponse of(String at, String rt, long expiresIn, User user) {
        return base(at, rt, expiresIn)
                .userId(user.getId()).email(user.getEmail())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .role(user.getRole().name()).build();
    }

    public static AuthResponse of(String at, String rt, long expiresIn, AdminUser admin) {
        return base(at, rt, expiresIn)
                .userId(admin.getId()).email(admin.getEmail())
                .firstName(admin.getFirstName()).lastName(admin.getLastName())
                .role(admin.getRole().name()).build();
    }

    private static AuthResponseBuilder base(String at, String rt, long expiresIn) {
        return AuthResponse.builder().accessToken(at).refreshToken(rt)
                .tokenType("Bearer").expiresIn(expiresIn);
    }
}
