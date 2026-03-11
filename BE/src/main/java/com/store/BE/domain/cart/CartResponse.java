package com.store.BE.domain.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Cart cart;
    private List<CartItemResponse> invalidItems;
    private List<CartItem> cartItems;
}
