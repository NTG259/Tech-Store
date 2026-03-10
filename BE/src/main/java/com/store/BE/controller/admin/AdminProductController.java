package com.store.BE.controller.admin;

import com.store.BE.domain.dto.ProductRequestDTO;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

//     1. Lấy danh sách tất cả sản phẩm
    @GetMapping()
    public ResponseEntity<PaginationResponse<Product>> getAllProductsByPagination(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        Pageable pageable = PageRequest.of(page - 1, size);
        ProductSearchRequest request = new ProductSearchRequest();
        request.setName(name);
        request.setCategoryId(categoryId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.productService.getAllProducts(request, pageable));
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
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody ProductRequestDTO product) {
        ApiResponse<Product> response = this.productService.createProduct(product);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 4. Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO product) {
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