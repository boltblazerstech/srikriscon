package com.ecommerce.backend.common.config;

import com.ecommerce.backend.common.security.JwtConfigurationException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Standard Base64-encoded 256-bit (32-byte) key.
     * Must NOT contain Base64URL characters ('_' or '-').
     */
    private String secret;
    private long accessTokenExpiryMs;
    private long adminAccessTokenExpiryMs;
    private long refreshTokenExpiryMs;

    /**
     * Validates the secret and returns the decoded bytes.
     * @return decoded secret bytes
     * @throws JwtConfigurationException if the secret is invalid
     */
    public byte[] validateAndGetDecodedSecret() {
        if (secret == null || secret.isBlank()) {
            throw new JwtConfigurationException();
        }

        // Standard Base64 only (no URL-safe variants)
        if (secret.contains("_") || secret.contains("-")) {
            throw new JwtConfigurationException();
        }

        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length < 32) {
                throw new JwtConfigurationException();
            }
            return decoded;
        } catch (IllegalArgumentException e) {
            throw new JwtConfigurationException();
        }
    }

    /**
     * Returns the secret as a SecretKey object.
     * @return SecretKey instance
     * @throws JwtConfigurationException if the secret is invalid
     */
    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(validateAndGetDecodedSecret());
    }

    /**
     * Validates the JWT configuration.
     * @throws JwtConfigurationException if the configuration is invalid
     */
    public void validate() {
        validateAndGetDecodedSecret(); // Will throw if invalid
        // Additional validation can be added here if needed
        if (accessTokenExpiryMs <= 0) {
            throw new JwtConfigurationException("Access token expiry must be positive");
        }
        if (adminAccessTokenExpiryMs <= 0) {
            throw new JwtConfigurationException("Admin access token expiry must be positive");
        }
        if (refreshTokenExpiryMs <= 0) {
            throw new JwtConfigurationException("Refresh token expiry must be positive");
        }
    }
}
