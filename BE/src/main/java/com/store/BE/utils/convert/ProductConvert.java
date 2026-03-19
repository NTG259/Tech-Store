package com.store.BE.utils.convert;

import com.store.BE.domain.dto.ProductRequestDTO;
import com.store.BE.domain.product.Category;
import com.store.BE.domain.product.Product;
import com.store.BE.service.CategoryService;
import lombok.RequiredArgsConstructor;

public class ProductConvert {

    public static Product convertToProduct(ProductRequestDTO dto) {
        Product rs = new Product();
        rs.setProductImg(dto.getProductImg());
        rs.setName(dto.getName());
        rs.setPrice(dto.getPrice());
        Category category = new Category();
        category.setId(dto.getCategoryId());

        rs.setCategory(category);

        rs.setBrand(dto.getBrand());
        rs.setProductStatus(dto.getProductStatus());
        rs.setDescription(dto.getDescription());
        rs.setStockQuantity(dto.getStockQuantity());
        return rs;
    }
}
