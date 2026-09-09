package com.ecommerce.backend.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    public enum VariantType {
        SIZE, DESIGN, MATERIAL, COLOR;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static VariantType fromString(String value) {
            if (value == null) return null;
            try {
                return VariantType.valueOf(value.toUpperCase().trim());
            } catch (IllegalArgumentException e) {
                // Return null or throw custom readable exception if not matched
                throw new IllegalArgumentException("Invalid variant type: " + value + ". Must be one of: SIZE, DESIGN, MATERIAL, COLOR");
            }
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private VariantType type;

    @Column(nullable = false, length = 100)
    private String value;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private int stockQuantity = 0;

    @Column(name = "is_active", nullable = false)
    @Convert(converter = org.hibernate.type.NumericBooleanConverter.class)
    @Builder.Default
    private boolean active = true;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private int sortOrder = 0;
}
