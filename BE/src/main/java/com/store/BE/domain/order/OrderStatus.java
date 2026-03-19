package com.store.BE.domain.order;

public enum OrderStatus {
    PENDING,    // Đơn hàng đang chờ xử lý
    CONFIRMED,      // Đơn hàng được nhận
    SHIPPING,       // đang giao
    DELIVERED,      // đã giao
    CANCELLED       // đã hủy
}