package com.ecommerce.backend.common.security;

/**
 * Thrown when the application detects an invalid, missing, or insecure JWT configuration
 * during startup or bean initialization.
 */
public class JwtConfigurationException extends IllegalStateException {

    public static final String ERROR_MESSAGE =
            "JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits (32 decoded bytes).\n" +
            "Generate a new Base64 secret and set it in the JWT_SECRET environment variable.";

    public JwtConfigurationException() {
        super(ERROR_MESSAGE);
    }

    public JwtConfigurationException(String message) {
        super(message);
    }

    public JwtConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}
