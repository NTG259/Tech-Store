package com.store.BE.controller.client;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.service.ProductService;
import com.store.BE.utils.specification.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/products")
@AllArgsConstructor
public class ProductController {
    private final ProductService productService;

//    @GetMapping("")
//    public ResponseEntity<ApiResponse<List<Product>>> getAllProduct() {
//        return ResponseEntity.ok().body(this.productService.getAllProductIsPublishing());
//    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> viewDetailProduct(@PathVariable Long id) {
        ApiResponse<Product> response = this.productService.getProduct(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<Product>> getAllProductsByPagination(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam(value = "status", required = false)ProductStatus status,
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        Pageable pageable = PageRequest.of(page - 1, size);
        ProductSearchRequest request = new ProductSearchRequest();
        request.setProductStatus(status);
        request.setCategoryId(categoryId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.productService.getAllProductIsPubLicPagination(request, pageable));
    }
}
