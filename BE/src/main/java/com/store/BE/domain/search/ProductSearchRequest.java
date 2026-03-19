package com.store.BE.domain.search;

import com.store.BE.domain.product.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {
    private String name;
    private Long categoryId;
    private Long quantity;
    private String productStatus;
    private Long minPrice;
    private Long maxPrice;
}
