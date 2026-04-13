package com.store.BE.domain.product;

public interface CategoryResponse {
    Long getId();
    String getName();
    String getSlug();

    Long getTotalProducts();   // số sản phẩm
    Long getTotalSold();       // số lượng bán
    Long getTotalRevenue();    // tổng tiền
}