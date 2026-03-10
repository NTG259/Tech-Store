package com.store.BE.service.implement;

import com.store.BE.domain.cart.Cart;
import com.store.BE.domain.cart.CartItem;
import com.store.BE.domain.dto.CartRequest;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.user.User;
import com.store.BE.repository.CartItemRepository;
import com.store.BE.repository.CartRepository;
import com.store.BE.repository.ProductRepository;
import com.store.BE.repository.UserRepository;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ApiResponse<Cart> getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);

        if (optionalCart.isEmpty()) {
            Cart newCart = new Cart();
            newCart.setUser(user);
            Cart cartRes = cartRepository.save(newCart);
            return new ApiResponse<>(cartRes, "Tạo giỏ hàng thành công", null, HttpStatus.CREATED.value());
        }
        return new ApiResponse<>(optionalCart.get(), "Lấy giỏ hàng thành công", null, HttpStatus.OK.value());
    }

    @Transactional
    public ApiResponse<Cart> addToCart(Long userId, CartRequest request) {
        Cart cart = getCartByUserId(userId).data();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.addCartItem(newItem);
            cartItemRepository.save(newItem);
        }
        return new ApiResponse<>(
                cartRepository.save(cart),
                "Thêm sản phẩm thành công ",
                null,
                HttpStatus.OK.value()
                );
    }

    @Transactional
    public ApiResponse<Cart> updateCartItem(Long userId, Long itemId, Long newQuantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND));

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        return getCartByUserId(userId);
    }

    @Transactional
    public ApiResponse<Cart> removeCartItem(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId).data();
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND));

        cart.removeCartItem(item);
        cartItemRepository.delete(item);
        return new ApiResponse<>(
                cartRepository.save(cart),
                "Xoá sản phẩm khỏi giỏ hàng thành công",
                null,
                HttpStatus.OK.value());
    }

    @Transactional
    public  ApiResponse<Void> removeCart(Long userId) {
        Cart cart = getCartByUserId(userId).data();
        cartRepository.delete(cart);
        return new ApiResponse<>(
                null,
                "Xóa giỏ hàng thành công",
                null,
                HttpStatus.OK.value()
        );
    }
}