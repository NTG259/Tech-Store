package com.store.BE.service.implement;

import com.store.BE.domain.dto.ProductRequestDTO;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.repository.ProductRepository;
import com.store.BE.service.ProductService;
import com.store.BE.utils.convert.PaginationUtil;
import com.store.BE.utils.convert.ProductConvert;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.specification.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    // Tạo sản phẩm mới
    public ApiResponse<Product> createProduct(ProductRequestDTO dto) {
        Product product = ProductConvert.convertToProduct(dto);
        if (this.productRepository.existByName(product.getName())) {
            throw new BusinessException(ErrorCode.NAME_ALREADY_EXIST);
        }

        Product savedProduct = this.productRepository.save(product);
        return new ApiResponse<>(savedProduct, "Tạo sản phẩm thành công", null, HttpStatus.CREATED.value());
    }

    // Cập nhật sản phẩm
    public ApiResponse<Product> updateProduct(Long id, ProductRequestDTO dto) {
        if (!productRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        Product product = ProductConvert.convertToProduct(dto);
        product.setId(id);
        Product updatedProduct = this.productRepository.save(product);
        return new ApiResponse<>(updatedProduct, "Cập nhật sản phẩm thành công", null, HttpStatus.OK.value());
    }

    // Lấy thông tin chi tiết 1 sản phẩm
    public ApiResponse<Product> getProduct(Long id) {
        Product product = this.productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        return new ApiResponse<>(product, "Lấy thông tin sản phẩm thành công", null, HttpStatus.OK.value());
    }

    // Lấy tất cả sản phẩm
    public PaginationResponse<Product> getAllProducts(ProductSearchRequest request, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.filter(request);
        Page<Product> productPage = this.productRepository.findAll(specification, pageable);
        return PaginationUtil.convertResponse(productPage);
    }

    public PaginationResponse<Product> getAllProductIsPubLicPagination(ProductSearchRequest request, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.filter(request);
        Specification<Product> isPublic = (root, query, cb) ->
                cb.equal(root.get("productStatus"), ProductStatus.PUBLISHED);
        Specification<Product> inStock = (root, query, cb) ->
                cb.greaterThan(root.get("stockQuantity"), 0);
        specification = specification.and(isPublic).and(inStock);
        Page<Product> productPage = this.productRepository.findAll(specification, pageable);
        return PaginationUtil.convertResponse(productPage);
    }

    // Xóa sản phẩm
    public ApiResponse<Void> deleteProduct(Long id) {
        if (!this.productRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
        this.productRepository.deleteById(id);
        return new ApiResponse<>(null, "Xóa sản phẩm thành công", null, HttpStatus.OK.value());
    }

    public ApiResponse<List<Product>> getLatestProducts() {
        return new ApiResponse<>(
                productRepository.findTop8ByOrderByCreatedAtDesc(),
                "Lấy 8 sản phẩm mới nhất",
                null,
                HttpStatus.OK.value()
        );
    }
}