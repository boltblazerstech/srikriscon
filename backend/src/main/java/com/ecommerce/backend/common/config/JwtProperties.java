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

    /**
     * Access token validity in milliseconds. Default 15 minutes (900,000 ms).
     */
    private long accessTokenExpiryMs = 900000;

    /**
     * Refresh token validity in milliseconds. Default 7 days (604,800,000 ms).
     */
    private long refreshTokenExpiryMs = 604800000;

    @PostConstruct
    public void validate() {
        validateAndGetDecodedSecret();
    }

    /**
     * Validates the JWT secret format and bit strength.
     *
     * @return Decoded 256-bit (>= 32 bytes) key byte array.
     * @throws JwtConfigurationException if secret is missing, empty, invalid Base64, contains '_' or '-', or is shorter than 256 bits (32 bytes).
     */
    public byte[] validateAndGetDecodedSecret() {
        if (secret == null || secret.isBlank()) {
            throw new JwtConfigurationException();
        }

        String trimmed = secret.trim();

        // Standard Base64 (RFC 4648 §4) uses [A-Za-z0-9+/=]. Reject Base64URL characters immediately.
        if (trimmed.contains("_") || trimmed.contains("-")) {
            throw new JwtConfigurationException();
        }

        byte[] decoded;
        try {
            decoded = Decoders.BASE64.decode(trimmed);
        } catch (Exception ex) {
            throw new JwtConfigurationException();
        }

        // HMAC-SHA-256 requires at least 256 bits (32 bytes)
        if (decoded == null || decoded.length < 32) {
            throw new JwtConfigurationException();
        }

        return decoded;
    }

    /**
     * Convenience method to obtain a validated cryptographic {@link SecretKey}.
     */
    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(validateAndGetDecodedSecret());
    }

    @Override
    public String toString() {
        return "JwtProperties(secret=[PROTECTED], accessTokenExpiryMs=" + accessTokenExpiryMs
                + ", refreshTokenExpiryMs=" + refreshTokenExpiryMs + ")";
    }
}
