package com.ecommerce.backend.common.security;

import com.ecommerce.backend.common.config.JwtProperties;
import io.jsonwebtoken.io.Encoders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private JwtProperties props;
    private String validSecret;

    @BeforeEach
    void setUp() {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        validSecret = Encoders.BASE64.encode(key);

        props = new JwtProperties();
        props.setSecret(validSecret);
        props.setAccessTokenExpiryMs(3600000); // 1 hour
        props.setRefreshTokenExpiryMs(86400000);
    }

    @Test
    @DisplayName("JwtService should initialize successfully with valid 256-bit secret")
    void constructor_withValidSecret_shouldSucceed() {
        JwtService service = new JwtService(props);
        assertThat(service).isNotNull();
    }

    @Test
    @DisplayName("JwtService should throw JwtConfigurationException when secret is missing")
    void constructor_withMissingSecret_shouldFail() {
        props.setSecret(null);

        assertThatThrownBy(() -> new JwtService(props))
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("JwtService should throw JwtConfigurationException when secret is empty")
    void constructor_withEmptySecret_shouldFail() {
        props.setSecret("");

        assertThatThrownBy(() -> new JwtService(props))
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("JwtService should throw JwtConfigurationException when secret contains '_'")
    void constructor_withUnderscore_shouldFailWithClearMessage() {
        props.setSecret("Invalid_Secret_Containing_Underscore_For_Testing_Base64URL==");

        assertThatThrownBy(() -> new JwtService(props))
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits")
                .hasMessageNotContaining("Illegal base64 character: '_'");
    }

    @Test
    @DisplayName("JwtService should throw JwtConfigurationException when secret contains '-'")
    void constructor_withHyphen_shouldFailWithClearMessage() {
        props.setSecret("Invalid-Secret-Containing-Hyphen-For-Testing-Base64URL====");

        assertThatThrownBy(() -> new JwtService(props))
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("JwtService should throw JwtConfigurationException when decoded secret is < 32 bytes")
    void constructor_withShortSecret_shouldFailWithClearMessage() {
        byte[] shortBytes = new byte[16]; // 128 bits
        new SecureRandom().nextBytes(shortBytes);
        props.setSecret(Encoders.BASE64.encode(shortBytes));

        assertThatThrownBy(() -> new JwtService(props))
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("Should successfully sign JWT and extract username and role claims")
    void generateAccessToken_and_parseClaims_shouldSucceed() {
        JwtService service = new JwtService(props);

        UserDetails user = new User(
                "john@example.com",
                "password123",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        String token = service.generateAccessToken(user);

        assertThat(token).isNotBlank();
        assertThat(service.extractUsername(token)).isEqualTo("john@example.com");
        assertThat(service.extractRole(token)).isEqualTo("ADMIN");
        assertThat(service.isValid(token)).isTrue();
    }

    @Test
    @DisplayName("Should handle role authority without ROLE_ prefix")
    void generateAccessToken_withPlainRoleAuthority_shouldSucceed() {
        JwtService service = new JwtService(props);

        UserDetails user = new User(
                "user@example.com",
                "password123",
                List.of(new SimpleGrantedAuthority("CUSTOMER"))
        );

        String token = service.generateAccessToken(user);

        assertThat(service.extractRole(token)).isEqualTo("CUSTOMER");
        assertThat(service.extractUsername(token)).isEqualTo("user@example.com");
        assertThat(service.isValid(token)).isTrue();
    }

    @Test
    @DisplayName("Should handle user with no authorities")
    void generateAccessToken_withNoAuthorities_shouldDefaultToUnknownRole() {
        JwtService service = new JwtService(props);

        UserDetails user = new User(
                "noauth@example.com",
                "password123",
                Collections.emptyList()
        );

        String token = service.generateAccessToken(user);

        assertThat(service.extractRole(token)).isEqualTo("UNKNOWN");
        assertThat(service.isValid(token)).isTrue();
    }

    @Test
    @DisplayName("isValid should return false for tampered token")
    void isValid_withTamperedToken_shouldReturnFalse() {
        JwtService service = new JwtService(props);

        UserDetails user = new User("alice@example.com", "pass", List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        String token = service.generateAccessToken(user);

        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";
        assertThat(service.isValid(tamperedToken)).isFalse();
    }

    @Test
    @DisplayName("isValid should return false for expired token")
    void isValid_withExpiredToken_shouldReturnFalse() throws InterruptedException {
        // 1 ms expiry
        props.setAccessTokenExpiryMs(1);
        JwtService service = new JwtService(props);

        UserDetails user = new User("bob@example.com", "pass", List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        String token = service.generateAccessToken(user);

        Thread.sleep(10); // Wait for token to expire

        assertThat(service.isValid(token)).isFalse();
    }

    @Test
    @DisplayName("isValid should return false for malformed token string")
    void isValid_withMalformedToken_shouldReturnFalse() {
        JwtService service = new JwtService(props);

        assertThat(service.isValid("this.is.not.a.valid.jwt")).isFalse();
        assertThat(service.isValid("")).isFalse();
        assertThat(service.isValid(null)).isFalse();
    }
}
