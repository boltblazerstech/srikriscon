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
}
