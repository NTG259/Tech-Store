package com.store.BE.service;

import com.store.BE.domain.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.repo.ProductRepository;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    // 1. Tạo sản phẩm mới
    public ApiResponse<Product> createProduct(Product product) {
        if (this.productRepository.existByName(product.getName())) {
            throw new BusinessException(ErrorCode.NAME_ALREADY_EXIST);
        }

        Product savedProduct = this.productRepository.save(product);
        return new ApiResponse<>(savedProduct, "Tạo sản phẩm thành công", null, HttpStatus.CREATED.value());
    }

    // 2. Cập nhật sản phẩm
    public ApiResponse<Product> updateProduct(Long id, Product product) {
        if (!productRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        product.setId(id);
        Product updatedProduct = this.productRepository.save(product);
        return new ApiResponse<>(updatedProduct, "Cập nhật sản phẩm thành công", null, HttpStatus.OK.value());
    }

    // 3. Lấy thông tin chi tiết 1 sản phẩm
    public ApiResponse<Product> getProduct(Long id) {
        Product product = this.productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        return new ApiResponse<>(product, "Lấy thông tin sản phẩm thành công", null, HttpStatus.OK.value());
    }

    // 4. Lấy tất cả sản phẩm
    public ApiResponse<List<Product>> getAllProducts() {
        List<Product> products = this.productRepository.findAll();
        return new ApiResponse<>(products, "Lấy danh sách sản phẩm thành công", null, HttpStatus.OK.value());
    }

    // 5. Xóa sản phẩm
    public ApiResponse<Void> deleteProduct(Long id) {
        if (!this.productRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
        this.productRepository.deleteById(id);
        return new ApiResponse<>(null, "Xóa sản phẩm thành công", null, HttpStatus.OK.value());
    }
}