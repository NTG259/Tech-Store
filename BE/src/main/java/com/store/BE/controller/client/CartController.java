package com.store.BE.controller.client;

import com.store.BE.domain.cart.Cart;
import com.store.BE.domain.cart.CartResponse;
import com.store.BE.domain.dto.CartRequest;
import com.store.BE.domain.order.CheckoutRequest;
import com.store.BE.domain.order.Order;
import com.store.BE.domain.order.OrderResponse;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.service.OrderService;
import com.store.BE.service.UserService;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import com.store.BE.service.implement.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final UserService userService;
    private final OrderService orderService;

    private Long getCurrentUserId() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_CREDENTIALS));

        return userService.handleFindUserByEmail(email).getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getMyCart() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok().body(this.cartService.getCartByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Cart>> addToCart(@RequestBody CartRequest request) {
        return ResponseEntity.ok()
                .body(this.cartService.addToCart(getCurrentUserId(), request));
    }

    @PutMapping("")
    public ResponseEntity<ApiResponse<Cart>> updateCartItem(
            @RequestBody CartRequest cartRequest
            ) {
            return ResponseEntity.ok()
                    .body(cartService
                            .updateCartItem(
                                    getCurrentUserId(),
                                    cartRequest.getProductId(),
                                    cartRequest.getQuantity()
                            )
                    );
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> removeCartItem(@PathVariable Long itemId) {
            return ResponseEntity.ok()
                            .body(cartService
                                    .removeCartItem(getCurrentUserId(), itemId)
                            );

    }

    @PostMapping("/checkout")
    public  ResponseEntity<ApiResponse<OrderResponse>> checkOut(@RequestBody CheckoutRequest checkoutRequest) {
            ApiResponse<OrderResponse> response = this.orderService.checkout(checkoutRequest);
            if (response.data().getPaymentMethod().equals("COD")) {
                cartService.removeCart(getCurrentUserId());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}