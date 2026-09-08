package com.ecommerce.backend.common.security;

import com.ecommerce.backend.common.config.JwtProperties;
import io.jsonwebtoken.io.Encoders;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration;
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.diagnostics.FailureAnalysis;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.NestedExceptionUtils;

import java.security.SecureRandom;

import static org.assertj.core.api.Assertions.assertThat;

class JwtStartupValidationTest {

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(JwtProperties.class)
    static class TestConfig {
        @Bean
        JwtService jwtService(JwtProperties props) {
            return new JwtService(props);
        }
    }

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withConfiguration(AutoConfigurations.of(
                    PropertyPlaceholderAutoConfiguration.class,
                    ConfigurationPropertiesAutoConfiguration.class
            ))
            .withUserConfiguration(TestConfig.class);

    @Test
    @DisplayName("Context starts successfully when valid Base64 256-bit secret is configured")
    void whenValidSecret_contextStarts() {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        String validSecret = Encoders.BASE64.encode(key);

        contextRunner
                .withPropertyValues("jwt.secret=" + validSecret)
                .run(context -> {
                    assertThat(context).hasNotFailed();
                    assertThat(context).hasSingleBean(JwtProperties.class);
                    assertThat(context).hasSingleBean(JwtService.class);
                });
    }

    @Test
    @DisplayName("Context fails with JwtConfigurationException when secret contains '_'")
    void whenSecretContainsUnderscore_contextFailsWithClearMessage() {
        contextRunner
                .withPropertyValues("jwt.secret=Invalid_Secret_Containing_An_Underscore_Key==")
                .run(context -> {
                    assertThat(context).hasFailed();
                    Throwable rootCause = NestedExceptionUtils.getRootCause(context.getStartupFailure());
                    assertThat(rootCause).isInstanceOf(JwtConfigurationException.class);
                    assertThat(rootCause.getMessage())
                            .contains("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits")
                            .doesNotContain("Illegal base64 character: '_'");
                });
    }

    @Test
    @DisplayName("Context fails with JwtConfigurationException when secret contains '-'")
    void whenSecretContainsHyphen_contextFailsWithClearMessage() {
        contextRunner
                .withPropertyValues("jwt.secret=Invalid-Secret-Containing-A-Hyphen-Key======")
                .run(context -> {
                    assertThat(context).hasFailed();
                    Throwable rootCause = NestedExceptionUtils.getRootCause(context.getStartupFailure());
                    assertThat(rootCause).isInstanceOf(JwtConfigurationException.class);
                    assertThat(rootCause.getMessage())
                            .contains("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
                });
    }

    @Test
    @DisplayName("Context fails with JwtConfigurationException when secret is empty")
    void whenSecretIsEmpty_contextFailsWithClearMessage() {
        contextRunner
                .withPropertyValues("jwt.secret=")
                .run(context -> {
                    assertThat(context).hasFailed();
                    Throwable rootCause = NestedExceptionUtils.getRootCause(context.getStartupFailure());
                    assertThat(rootCause).isInstanceOf(JwtConfigurationException.class);
                    assertThat(rootCause.getMessage())
                            .contains("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
                });
    }

    @Test
    @DisplayName("Context fails with JwtConfigurationException when secret is not specified")
    void whenSecretIsMissing_contextFailsWithClearMessage() {
        contextRunner
                .run(context -> {
                    assertThat(context).hasFailed();
                    Throwable rootCause = NestedExceptionUtils.getRootCause(context.getStartupFailure());
                    assertThat(rootCause).isInstanceOf(JwtConfigurationException.class);
                    assertThat(rootCause.getMessage())
                            .contains("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
                });
    }

    @Test
    @DisplayName("Context fails with JwtConfigurationException when secret decoded is < 32 bytes")
    void whenSecretIsTooShort_contextFailsWithClearMessage() {
        byte[] shortKey = new byte[16]; // 128 bits
        new SecureRandom().nextBytes(shortKey);
        String shortSecret = Encoders.BASE64.encode(shortKey);

        contextRunner
                .withPropertyValues("jwt.secret=" + shortSecret)
                .run(context -> {
                    assertThat(context).hasFailed();
                    Throwable rootCause = NestedExceptionUtils.getRootCause(context.getStartupFailure());
                    assertThat(rootCause).isInstanceOf(JwtConfigurationException.class);
                    assertThat(rootCause.getMessage())
                            .contains("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
                });
    }

    @Test
    @DisplayName("JwtFailureAnalyzer produces clean description and action")
    void failureAnalyzer_producesActionableReport() {
        JwtFailureAnalyzer analyzer = new JwtFailureAnalyzer();
        JwtConfigurationException ex = new JwtConfigurationException();

        FailureAnalysis analysis = analyzer.analyze(ex, ex);

        assertThat(analysis).isNotNull();
        assertThat(analysis.getDescription())
                .isEqualTo("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits (32 decoded bytes).");
        assertThat(analysis.getAction())
                .isEqualTo("Generate a new Base64 secret and set it in the JWT_SECRET environment variable.");
    }
}
