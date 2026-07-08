package com.ecommerce.backend.auth.service;

import com.ecommerce.backend.auth.dto.*;
import com.ecommerce.backend.auth.entity.*;
import com.ecommerce.backend.auth.repository.*;
import com.ecommerce.backend.common.config.AppProperties;
import com.ecommerce.backend.common.config.JwtProperties;
import com.ecommerce.backend.common.exception.*;
import com.ecommerce.backend.common.security.JwtService;
import com.ecommerce.backend.email.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository            userRepository;
    private final AdminUserRepository       adminUserRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtService                jwtService;
    private final JwtProperties             jwtProperties;
    private final PasswordEncoder           passwordEncoder;
    private final AuthenticationManager     authenticationManager;
    private final EmailService              emailService;
    private final AppProperties             appProperties;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // ─── Customer registration ────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email is already registered");
        }
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .phone(req.getPhone())
                .build();
        userRepository.save(user);
        return buildCustomerTokens(user);
    }

    // ─── Customer login ───────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is inactive");
        }
        return buildCustomerTokens(user);
    }

    // ─── Admin login ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse loginAdmin(LoginRequest req) {
        AdminUser admin = adminUserRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!admin.isEnabled()) {
            throw new UnauthorizedException("Admin account is inactive");
        }
        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return buildAdminTokens(admin);
    }

    // ─── Token refresh (customer + admin) ────────────────────────────────────

    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        RefreshToken stored = refreshTokenRepository.findByToken(req.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found"));

        if (stored.isExpired()) {
            refreshTokenRepository.delete(stored);
            throw new UnauthorizedException("Refresh token has expired — please log in again");
        }

        refreshTokenRepository.delete(stored);

        if (stored.isAdminToken()) {
            AdminUser admin = stored.getAdminUser();
            if (!admin.isEnabled()) throw new UnauthorizedException("Admin account is inactive");
            return buildAdminTokens(admin);
        } else {
            User user = stored.getUser();
            if (!user.isEnabled()) throw new UnauthorizedException("Account is inactive");
            return buildCustomerTokens(user);
        }
    }

    // ─── Logout ───────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByToken(rawRefreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    // ─── Forgot password ──────────────────────────────────────────────────────

    /**
     * Sends a password-reset email if the address belongs to a known account.
     * Always returns silently — does NOT reveal whether the address exists.
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
        String email    = req.getEmail().toLowerCase().trim();
        String userType = resolveUserType(email);

        if (userType == null) {
            throw new BadRequestException("Email address is not registered");
        }

        // Invalidate any existing unused tokens for this email
        passwordResetTokenRepository.deleteByEmailAndUserType(email, userType);

        String token   = generateSecureToken();
        String baseUrl = "ADMIN".equals(userType)
                ? appProperties.getAdminUrl()
                : appProperties.getFrontendUrl();
        String resetLink = baseUrl + "/reset-password?token=" + token;

        PasswordResetToken prt = PasswordResetToken.builder()
                .token(token)
                .email(email)
                .userType(userType)
                .expiresAt(LocalDateTime.now().plusMinutes(appProperties.getResetTokenExpiryMins()))
                .build();
        passwordResetTokenRepository.save(prt);

        emailService.sendPasswordReset(email, resetLink, appProperties.getResetTokenExpiryMins());
        log.info("Password reset token issued for {} (type={})", email, userType);
    }

    // ─── Reset password ───────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        PasswordResetToken prt = passwordResetTokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or unknown reset token"));

        if (!prt.isValid()) {
            throw new BadRequestException(prt.isExpired()
                    ? "Reset token has expired — please request a new one"
                    : "Reset token has already been used");
        }

        String encoded = passwordEncoder.encode(req.getNewPassword());

        if ("ADMIN".equals(prt.getUserType())) {
            AdminUser admin = adminUserRepository.findByEmail(prt.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));
            admin.setPassword(encoded);
            adminUserRepository.save(admin);
            refreshTokenRepository.deleteByAdminUser(admin);
        } else {
            User user = userRepository.findByEmail(prt.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
            user.setPassword(encoded);
            userRepository.save(user);
            refreshTokenRepository.deleteByUser(user);
        }

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        log.info("Password reset successful for {} (type={})", prt.getEmail(), prt.getUserType());
    }

    // ─── Validate reset token (non-destructive) ───────────────────────────────

    @Transactional(readOnly = true)
    public void validateResetToken(String token) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        if (!prt.isValid()) {
            throw new BadRequestException(prt.isExpired()
                    ? "Reset token has expired" : "Reset token has already been used");
        }
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    private AuthResponse buildCustomerTokens(User user) {
        String at  = jwtService.generateAccessToken(user);
        String raw = generateSecureToken();
        saveRefreshToken(raw, user, null);
        return AuthResponse.of(at, raw, jwtProperties.getAccessTokenExpiryMs() / 1000, user);
    }

    private AuthResponse buildAdminTokens(AdminUser admin) {
        String at  = jwtService.generateAccessToken(admin);
        String raw = generateSecureToken();
        saveRefreshToken(raw, null, admin);
        return AuthResponse.of(at, raw, jwtProperties.getAdminAccessTokenExpiryMs() / 1000, admin);
    }

    private void saveRefreshToken(String raw, User user, AdminUser admin) {
        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .adminUser(admin)
                .token(raw)
                .expiresAt(LocalDateTime.now()
                        .plusSeconds(jwtProperties.getRefreshTokenExpiryMs() / 1000))
                .build();
        refreshTokenRepository.save(rt);
    }

    /** Identifies which table owns the email; returns "CUSTOMER", "ADMIN", or null. */
    private String resolveUserType(String email) {
        if (adminUserRepository.existsByEmail(email)) return "ADMIN";
        if (userRepository.existsByEmail(email))      return "CUSTOMER";
        return null;
    }

    /** 43-character URL-safe cryptographically random token. */
    private static String generateSecureToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
