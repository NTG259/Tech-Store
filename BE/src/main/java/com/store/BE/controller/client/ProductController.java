package com.store.BE.controller.client;

import com.store.BE.domain.order.OrderItem;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.service.DashboardService;
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
    private final DashboardService dashboardService;
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
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "minPrice", required = false) Long minPrice,
            @RequestParam(value = "maxPrice", required = false) Long maxPrice) {
        Pageable pageable = PageRequest.of(page - 1, size);
        ProductSearchRequest request = new ProductSearchRequest();
        request.setCategoryId(categoryId);
        request.setName(name);
        request.setMaxPrice(maxPrice);
        request.setMinPrice(minPrice);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.productService.getAllProductIsPubLicPagination(request, pageable));
    }

    @GetMapping("/new")
    public ResponseEntity<ApiResponse<List<Product>>> getLatestProducts() {
        return ResponseEntity.ok().body(
                this.productService.getLatestProducts(ProductStatus.PUBLISHED)
        );
    }

    @GetMapping("/hot")
    public ResponseEntity<ApiResponse<List<OrderItem>>> getHotProducts() {
        return ResponseEntity.ok().body(
                this.dashboardService.getTop10HotProduct()
        );
    }
}
