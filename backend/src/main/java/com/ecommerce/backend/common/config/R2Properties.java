package com.ecommerce.backend.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cloudflare.r2")
public class R2Properties {
    private String accessKey;
    private String secretKey;
    private String bucket;
    private String endpoint;
    private String publicUrl;
    private String region;
}
