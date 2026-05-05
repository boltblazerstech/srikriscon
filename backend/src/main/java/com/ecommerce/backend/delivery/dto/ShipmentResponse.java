package com.ecommerce.backend.delivery.dto;

import com.ecommerce.backend.delivery.entity.Shipment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ShipmentResponse {

    private Long id;
    private Long orderId;
    private String shiprocketOrderId;
    private String shiprocketShipmentId;
    private String awbCode;
    private String courierName;
    private String status;
    private String trackingUrl;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;

    public static ShipmentResponse from(Shipment s) {
        return ShipmentResponse.builder()
                .id(s.getId())
                .orderId(s.getOrder().getId())
                .shiprocketOrderId(s.getShiprocketOrderId())
                .shiprocketShipmentId(s.getShiprocketShipmentId())
                .awbCode(s.getAwbCode())
                .courierName(s.getCourierName())
                .status(s.getStatus())
                .trackingUrl(s.getTrackingUrl())
                .estimatedDelivery(s.getEstimatedDelivery())
                .shippedAt(s.getShippedAt())
                .deliveredAt(s.getDeliveredAt())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
