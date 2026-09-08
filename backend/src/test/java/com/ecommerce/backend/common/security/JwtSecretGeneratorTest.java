package com.ecommerce.backend.common.security;

import com.ecommerce.backend.common.config.JwtProperties;
import io.jsonwebtoken.io.Decoders;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtSecretGeneratorTest {

    @Test
    @DisplayName("generateSecret() should produce a valid 256-bit standard Base64 secret")
    void generateSecret_shouldProduceValid256BitBase64Secret() {
        String secret = JwtSecretGenerator.generateSecret();

        assertThat(secret).isNotBlank();
        assertThat(secret).doesNotContain("_").doesNotContain("-");

        byte[] decoded = Decoders.BASE64.decode(secret);
        assertThat(decoded).hasSize(32);

        // Verify it works with JwtProperties
        JwtProperties props = new JwtProperties();
        props.setSecret(secret);
        assertThat(props.validateAndGetDecodedSecret()).hasSize(32);
    }

    @Test
    @DisplayName("generateSecret(int) with custom byte length should produce expected byte size")
    void generateSecret_withCustomByteLength_shouldProduceExpectedBytes() {
        String secret64 = JwtSecretGenerator.generateSecret(64);
        byte[] decoded64 = Decoders.BASE64.decode(secret64);
        assertThat(decoded64).hasSize(64);
    }

    @Test
    @DisplayName("generateSecret(int) should throw IllegalArgumentException when length < 32")
    void generateSecret_tooShort_shouldThrowIllegalArgumentException() {
        assertThatThrownBy(() -> JwtSecretGenerator.generateSecret(16))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 32 bytes");
    }

    @Test
    @DisplayName("generateSecret() should generate cryptographically unique secrets across calls")
    void generateSecret_shouldBeRandom() {
        Set<String> secrets = new HashSet<>();
        for (int i = 0; i < 50; i++) {
            secrets.add(JwtSecretGenerator.generateSecret());
        }
        assertThat(secrets).hasSize(50);
    }
}
