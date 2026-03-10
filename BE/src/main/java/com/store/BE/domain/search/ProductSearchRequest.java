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
    private ProductStatus productStatus;
    private Long quantity;
}
