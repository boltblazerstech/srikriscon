package com.ecommerce.backend.common.config;

import com.ecommerce.backend.common.security.JwtConfigurationException;
import io.jsonwebtoken.io.Encoders;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.security.SecureRandom;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtPropertiesTest {

    private JwtProperties props;

    @BeforeEach
    void setUp() {
        props = new JwtProperties();
    }

    @Test
    @DisplayName("Should succeed with valid 256-bit (32 bytes) standard Base64 secret")
    void validBase64_256BitSecret_shouldSucceed() {
        byte[] rawKey = new byte[32];
        new SecureRandom().nextBytes(rawKey);
        String base64Secret = Encoders.BASE64.encode(rawKey);

        props.setSecret(base64Secret);
        byte[] decoded = props.validateAndGetDecodedSecret();

        assertThat(decoded).isNotNull();
        assertThat(decoded).hasSize(32);
        assertThat(props.getSecretKey()).isNotNull();
    }

    @Test
    @DisplayName("Should succeed with valid 512-bit (64 bytes) standard Base64 secret")
    void validBase64_512BitSecret_shouldSucceed() {
        byte[] rawKey = new byte[64];
        new SecureRandom().nextBytes(rawKey);
        String base64Secret = Encoders.BASE64.encode(rawKey);

        props.setSecret(base64Secret);
        byte[] decoded = props.validateAndGetDecodedSecret();

        assertThat(decoded).isNotNull();
        assertThat(decoded).hasSize(64);
    }

    @Test
    @DisplayName("Should throw JwtConfigurationException when secret is null")
    void missingSecret_shouldFailWithClearMessage() {
        props.setSecret(null);

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits")
                .hasMessageContaining("Generate a new Base64 secret and set it in the JWT_SECRET environment variable");
    }

    @Test
    @DisplayName("Should throw JwtConfigurationException when secret is empty")
    void emptySecret_shouldFailWithClearMessage() {
        props.setSecret("");

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("Should throw JwtConfigurationException when secret is only whitespace")
    void blankSecret_shouldFailWithClearMessage() {
        props.setSecret("     ");

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @ParameterizedTest(name = "Invalid secret with Base64URL underscore: {0}")
    @ValueSource(strings = {
            "U3Jpa3Jpc2NvblNlY3VyZV_XVEtleTIwMjZGb3JMb2NhbERldmVsb3BtZW50Cg==",
            "_secretThatContainsAnUnderscoreAndIsLongEnoughForHMACSHA256==",
            "validBase64PrefixPart1234567890_=="
    })
    @DisplayName("Should throw JwtConfigurationException when secret contains '_'")
    void invalidBase64_containingUnderscore_shouldFailWithClearMessage(String invalidSecret) {
        props.setSecret(invalidSecret);

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits")
                .hasMessageNotContaining("Illegal base64 character: '_'");
    }

    @ParameterizedTest(name = "Invalid secret with Base64URL hyphen: {0}")
    @ValueSource(strings = {
            "U3Jpa3Jpc2NvblNlY3VyZS-XVEtleTIwMjZGb3JMb2NhbERldmVsb3BtZW50Cg==",
            "-secretThatContainsAHyphenAndIsLongEnoughForHMACSHA256Key==",
            "validBase64PrefixPart1234567890-=="
    })
    @DisplayName("Should throw JwtConfigurationException when secret contains '-'")
    void invalidBase64_containingHyphen_shouldFailWithClearMessage(String invalidSecret) {
        props.setSecret(invalidSecret);

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("Should throw JwtConfigurationException when secret is malformed non-Base64 characters")
    void invalidBase64_malformedCharacters_shouldFailWithClearMessage() {
        props.setSecret("ThisIsNotBase64!@#$%^&*()_+~`|}{[]:;?><,./");

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("Should throw JwtConfigurationException when decoded secret is shorter than 32 bytes (256 bits)")
    void decodedSecret_shorterThan32Bytes_shouldFailWithClearMessage() {
        // 16 bytes = 128 bits
        byte[] shortKey = new byte[16];
        new SecureRandom().nextBytes(shortKey);
        String shortBase64 = Encoders.BASE64.encode(shortKey);

        props.setSecret(shortBase64);

        assertThatThrownBy(() -> props.validate())
                .isInstanceOf(JwtConfigurationException.class)
                .hasMessageContaining("JWT_SECRET must be a valid standard Base64-encoded key of at least 256 bits");
    }

    @Test
    @DisplayName("toString() must never expose the raw secret")
    void toString_shouldNotExposeSecret() {
        String secret = "U3Jpa3Jpc2NvblNlY3VyZUpXVEtleTIwMjZGb3JMb2NhbERldmVsb3BtZW50Cg==";
        props.setSecret(secret);

        String str = props.toString();
        assertThat(str).doesNotContain(secret);
        assertThat(str).contains("secret=[PROTECTED]");
    }
}
