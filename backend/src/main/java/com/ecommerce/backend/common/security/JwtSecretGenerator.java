package com.ecommerce.backend.common.security;

import io.jsonwebtoken.io.Encoders;

import java.security.SecureRandom;

/**
 * Utility to generate cryptographically secure standard Base64-encoded JWT secrets.
 */
public final class JwtSecretGenerator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private JwtSecretGenerator() {
        // Utility class
    }

    /**
     * Generates a cryptographically secure 256-bit (32-byte) key encoded in standard Base64.
     */
    public static String generateSecret() {
        return generateSecret(32);
    }

    /**
     * Generates a cryptographically secure key of the given byte length encoded in standard Base64.
     *
     * @param byteLength Number of random bytes (minimum 32 for HMAC-SHA-256).
     * @return Standard Base64 encoded key.
     */
    public static String generateSecret(int byteLength) {
        if (byteLength < 32) {
            throw new IllegalArgumentException("Byte length must be at least 32 bytes (256 bits) for HMAC-SHA-256");
        }
        byte[] bytes = new byte[byteLength];
        SECURE_RANDOM.nextBytes(bytes);
        return Encoders.BASE64.encode(bytes);
    }

    public static void main(String[] args) {
        int bytes = 32;
        if (args != null && args.length > 0) {
            try {
                bytes = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {
                // Use default 32 bytes
            }
        }
        String secret = generateSecret(bytes);
        System.out.println("================================================================================");
        System.out.println("Generated Standard Base64 JWT_SECRET (" + (bytes * 8) + "-bit / " + bytes + " bytes):");
        System.out.println(secret);
        System.out.println("================================================================================");
    }
}
