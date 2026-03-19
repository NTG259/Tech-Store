package com.store.BE.domain.cart;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private ProductResponse productResponse;
    private String reason;
}
