package com.store.BE.service.implement;

import com.store.BE.domain.cart.Cart;
import com.store.BE.domain.cart.CartItem;
import com.store.BE.domain.cart.CartItemResponse;
import com.store.BE.domain.cart.CartResponse;
import com.store.BE.domain.dto.CartRequest;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductResponse;
import com.store.BE.domain.product.ProductStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.user.User;
import com.store.BE.repository.CartItemRepository;
import com.store.BE.repository.CartRepository;
import com.store.BE.repository.ProductRepository;
import com.store.BE.repository.UserRepository;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ApiResponse<CartResponse> getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        CartResponse cartResponse = new CartResponse();
        if (optionalCart.isEmpty()) {
            Cart newCart = new Cart();
            newCart.setUser(user);
            Cart cartRes = cartRepository.save(newCart);
            cartResponse.setCart(cartRes);
            return new ApiResponse<>(cartResponse, "Tạo giỏ hàng thành công", null, HttpStatus.CREATED.value());
        } else {
            cartResponse.setCart(optionalCart.get());
            List<CartItemResponse> removeItems = new ArrayList<>();
            List<CartItem> validItems = new ArrayList<>();
            for (CartItem item : optionalCart.get().getCartItems()) {
                if (item.getProduct().getProductStatus() == ProductStatus.DISCONTINUED) {
                    Product product = item.getProduct();
                    CartItemResponse cartItemResponse = new CartItemResponse();
                    ProductResponse productResponse = new ProductResponse();
                    productResponse.setId(item.getId());
                    productResponse.setName(product.getName());
                    productResponse.setProductImg(product.getProductImg());
                    productResponse.setDescription(product.getDescription());
                    productResponse.setPrice(productResponse.getPrice());
                    cartItemResponse.setProductResponse(productResponse);
                    cartItemResponse.setReason("Sản phẩm đã ngừng kinh doanh");
                    removeItems.add(cartItemResponse);
                } else {
                    validItems.add(item);
                }
            }
            cartResponse.setInvalidItems(removeItems);
            cartResponse.setCartItems(validItems);
            return new ApiResponse<>(cartResponse, "Lấy giỏ hàng thành công", null, HttpStatus.OK.value());
        }
    }

    @Transactional
    public ApiResponse<Cart> addToCart(Long userId, CartRequest request) {
        Cart cart = getCartByUserId(userId).data().getCart();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (request.getQuantity() > product.getStockQuantity()) {
            throw new BusinessException(ErrorCode.QUANTITY_NOT_ENOUGH);
        }

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
        return new ApiResponse<>(
                getCartByUserId(userId).data().getCart(),
                "Cập nhật sản phẩm trong giỏ hàng",
                null, HttpStatus.OK.value());
    }

    @Transactional
    public ApiResponse<Cart> removeCartItem(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId).data().getCart();
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
    public void removeCart(Long userId) {
        Cart cart = getCartByUserId(userId).data().getCart();
        cartRepository.delete(cart);
        new ApiResponse<>(
                null,
                "Xóa giỏ hàng thành công",
                null,
                HttpStatus.OK.value()
        );
    }
}