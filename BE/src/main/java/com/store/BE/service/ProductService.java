package com.store.BE.service;

import com.store.BE.domain.dto.ProductRequestDTO;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.ProductSearchRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    public ApiResponse<Product> createProduct(ProductRequestDTO product);
    public ApiResponse<Product> updateProduct(Long id, ProductRequestDTO product);
    public ApiResponse<Product> getProduct(Long id);
    public PaginationResponse<Product> getAllProducts(ProductSearchRequest request, Pageable pageable);
    public PaginationResponse<Product> getAllProductIsPubLicPagination(ProductSearchRequest request, Pageable pageable);
    public ApiResponse<Void> deleteProduct(Long id);
//    public ApiResponse<List<Product>> getAllProductIsPublishing();
}
