package com.store.BE.domain.dto;

public interface HotProductProjection {
    Long getProductId();
    String getProductName();
    String getProductImg();
    Long getTotalSold();
    Long getStockQuantity();
    Double getTotalRevenue();
}