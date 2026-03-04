package com.store.BE.controller;

import com.store.BE.domain.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 1. Lấy danh sách tất cả sản phẩm
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        ApiResponse<List<Product>> response = this.productService.getAllProducts();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 2. Lấy chi tiết một sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        ApiResponse<Product> response = this.productService.getProduct(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 3. Tạo mới sản phẩm
    @PostMapping("")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        ApiResponse<Product> response = this.productService.createProduct(product);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 4. Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        ApiResponse<Product> response = this.productService.updateProduct(id, product);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 5. Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        ApiResponse<Void> response = this.productService.deleteProduct(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}