package com.ecommerce.backend.common.security;

import org.springframework.boot.diagnostics.AbstractFailureAnalyzer;
import org.springframework.boot.diagnostics.FailureAnalysis;

/**
 * Failure analyzer that intercepts {@link JwtConfigurationException} on startup
 * and prints a clean, actionable Spring Boot failure report.
 */
public class JwtFailureAnalyzer extends AbstractFailureAnalyzer<JwtConfigurationException> {

    @Override
    protected FailureAnalysis analyze(Throwable rootFailure, JwtConfigurationException cause) {
        return new FailureAnalysis(
                "JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits (32 decoded bytes).",
                "Generate a new Base64 secret and set it in the JWT_SECRET environment variable.",
                cause
        );
    }
}
