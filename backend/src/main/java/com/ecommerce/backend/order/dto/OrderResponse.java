package com.ecommerce.backend.order.dto;

import com.ecommerce.backend.order.entity.Order;
import com.ecommerce.backend.order.entity.OrderItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String status;
    private String paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal shippingAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String currency;
    private String shippingName;
    private String shippingPhone;
    private String shippingLine1;
    private String shippingLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
    private String notes;
    private String awbCode;
    private String shiprocketShipmentId;
    private List<ItemDto> items;
    private String paymentMethod;
    private LocalDateTime createdAt;

    public static OrderResponse from(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .status(o.getStatus().name())
                .paymentStatus(o.getPaymentStatus().name())
                .subtotal(o.getSubtotal())
                .discountAmount(o.getDiscountAmount())
                .shippingAmount(o.getShippingAmount())
                .taxAmount(o.getTaxAmount())
                .totalAmount(o.getTotalAmount())
                .currency(o.getCurrency())
                .shippingName(o.getShippingName())
                .shippingPhone(o.getShippingPhone())
                .shippingLine1(o.getShippingLine1())
                .shippingLine2(o.getShippingLine2())
                .shippingCity(o.getShippingCity())
                .shippingState(o.getShippingState())
                .shippingPostalCode(o.getShippingPostalCode())
                .shippingCountry(o.getShippingCountry())
                .notes(o.getNotes())
                .awbCode(o.getAwbCode())
                .shiprocketShipmentId(o.getShiprocketShipmentId())
                .items(o.getItems().stream().map(ItemDto::from).collect(Collectors.toList()))
                .paymentMethod(o.getPaymentMethod())
                .createdAt(o.getCreatedAt())
                .build();
    }

    @Data
    @Builder
    public static class ItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Long variantId;
        private String variantType;
        private String variantValue;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public static ItemDto from(OrderItem i) {
            return ItemDto.builder()
                    .id(i.getId())
                    .productId(i.getProductId())
                    .productName(i.getProductName())
                    .productSku(i.getProductSku())
                    .variantId(i.getVariantId())
                    .variantType(i.getVariantType())
                    .variantValue(i.getVariantValue())
                    .quantity(i.getQuantity())
                    .unitPrice(i.getUnitPrice())
                    .totalPrice(i.getTotalPrice())
                    .build();
        }
    }
}
