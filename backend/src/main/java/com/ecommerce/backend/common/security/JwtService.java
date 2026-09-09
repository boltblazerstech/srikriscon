package com.ecommerce.backend.common.security;

import com.ecommerce.backend.common.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long      accessTokenExpiryMs;
    private final long      adminAccessTokenExpiryMs;

    public JwtService(JwtProperties props) {
        this.secretKey                = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(props.getSecret()));
        this.accessTokenExpiryMs      = props.getAccessTokenExpiryMs();
        this.adminAccessTokenExpiryMs = props.getAdminAccessTokenExpiryMs();
    }

    /**
     * Generates a signed access token for any {@link UserDetails} principal.
     * The first granted authority (without the ROLE_ prefix) is embedded as the {@code role} claim.
     */
    public String generateAccessToken(UserDetails principal) {
        String role = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
                .orElse("UNKNOWN");

        boolean isAdmin = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ROLE_SUPER_ADMIN"));

        long expiry = isAdmin ? adminAccessTokenExpiryMs : accessTokenExpiryMs;

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiry))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Invalid JWT: {}", ex.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
