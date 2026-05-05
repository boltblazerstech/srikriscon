package com.ecommerce.backend.order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_sku")
    private String productSku;

    /** Nullable — set when the item has a specific variant selected. */
    @Column(name = "variant_id")
    private Long variantId;

    /** Snapshot of variant type (e.g. SIZE) at time of purchase. */
    @Column(name = "variant_type", length = 20)
    private String variantType;

    /** Snapshot of variant value (e.g. XL) at time of purchase. */
    @Column(name = "variant_value", length = 100)
    private String variantValue;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
}
