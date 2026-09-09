package com.ecommerce.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFaqDto {
    private Long id;
    private String question;
    private String answer;
    private Integer sortOrder;
}
