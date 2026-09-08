package com.ecommerce.backend.common.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically discovers and loads .env from the current working directory or parent directory
 * so that running {@code mvn spring-boot:run} from either repository root or the {@code backend/}
 * subfolder seamlessly loads environment variables using standard Java IO.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Path currentDir = Paths.get(".").toAbsolutePath().normalize();
        File currentEnv = currentDir.resolve(".env").toFile();
        File parentEnv = currentDir.resolve("..").resolve(".env").normalize().toFile();

        File targetEnv = null;
        if (currentEnv.exists() && currentEnv.isFile()) {
            targetEnv = currentEnv;
        } else if (parentEnv.exists() && parentEnv.isFile()) {
            targetEnv = parentEnv;
        }

        if (targetEnv != null) {
            try (BufferedReader reader = new BufferedReader(new FileReader(targetEnv, StandardCharsets.UTF_8))) {
                Map<String, Object> envMap = new HashMap<>();
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eq = line.indexOf('=');
                    if (eq > 0) {
                        String key = line.substring(0, eq).trim();
                        String value = line.substring(eq + 1).trim();

                        // Strip inline comments if value is not quoted
                        if (!value.startsWith("\"") && !value.startsWith("'")) {
                            int commentIdx = value.indexOf('#');
                            if (commentIdx >= 0) {
                                value = value.substring(0, commentIdx).trim();
                            }
                        } else if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
                            value = value.substring(1, value.length() - 1);
                        }

                        // Normalize human-friendly SQL logging flags to valid Spring LogLevel enum
                        if ("LOG_SQL".equalsIgnoreCase(key)) {
                            if ("ON".equalsIgnoreCase(value) || "TRUE".equalsIgnoreCase(value)) {
                                value = "DEBUG";
                            } else if ("FALSE".equalsIgnoreCase(value)) {
                                value = "OFF";
                            }
                        }

                        envMap.put(key, value);
                    }
                }

                if (!envMap.isEmpty()) {
                    environment.getPropertySources().addLast(new MapPropertySource("dotenvHierarchyPropertySource", envMap));
                }
            } catch (Exception ignored) {
                // Silently continue if .env cannot be parsed; existing validation will report missing properties
            }
        }
    }
}
