package com.store.BE.service;

import com.store.BE.domain.order.CheckoutRequest;
import com.store.BE.domain.order.OrderResponse;
import com.store.BE.domain.order.OrderStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.OrderSearchRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface OrderService {
    public PaginationResponse<OrderResponse> getAllOrdersByClient(OrderSearchRequest request, Pageable pageable);
    public PaginationResponse<OrderResponse> getAllOrdersByAdmin(OrderSearchRequest searchRequest, Pageable pageable);
    public ApiResponse<OrderResponse> checkout(CheckoutRequest request);
    public ApiResponse<OrderResponse> updateOrder(Long orderId, OrderStatus status);
    public Long totalRevenue();
    public Long totalSuccessOrder();
}
