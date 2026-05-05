package com.ecommerce.backend.settings.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SettingRequest {

    @NotBlank(message = "Key is required")
    private String key;

    private String value;
    private String group;
    private String description;
    private boolean isPublic;
}
