package com.ecommerce.backend.delivery.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ServiceabilityResponse {
    private String pincode;
    private boolean available;
    private List<Map<String, Object>> availableCouriers;
}
