package com.ecommerce.backend.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "shiprocket")
public class ShiprocketProperties {
    private String email;
    private String password;
    private String baseUrl;
    private int tokenRefreshIntervalHours;
}
