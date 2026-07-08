package com.ecommerce.backend.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    /** Base URL of the customer-facing storefront (used in email links). */
    private String frontendUrl;
    /** Base URL of the admin panel (used in admin email links). */
    private String adminUrl;
    /** Duration in minutes for which a password-reset token is valid. */
    private int resetTokenExpiryMins = 30;
}
