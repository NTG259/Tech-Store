package com.store.BE.utils.convert;

import com.store.BE.domain.order.Order;
import com.store.BE.domain.order.OrderItem;
import com.store.BE.domain.order.OrderItemResponse;
import com.store.BE.domain.order.OrderResponse;
import com.store.BE.repository.OrderItemRepository;
import org.jspecify.annotations.NonNull;

import java.util.ArrayList;
import java.util.List;

public class OrderConvert {
    public static OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setEmail(order.getUser().getEmail());
        response.setReceiverName(order.getReceiverName());
        response.setShippingAddress(order.getShippingAddress());
        response.setNote(order.getNote());
        response.setCreatedAt(order.getCreatedAt());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus(String.valueOf(order.getStatus()));
        response.setReceiverPhone(order.getReceiverPhone());
        response.setPaymentStatus(String.valueOf(order.getPaymentStatus()));
        List<OrderItem> orderItems = order.getOrderItems();
        List<OrderItemResponse> itemResponses = getOrderItemResponses(orderItems);
        response.setItems(itemResponses);
        return response;
    }

    private static @NonNull List<OrderItemResponse> getOrderItemResponses(List<OrderItem> orderItems) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for (OrderItem orderItem : orderItems) {
            OrderItemResponse token = new OrderItemResponse();
            token.setProductName(orderItem.getName());
            token.setProductImg(orderItem.getProductImg());
            token.setPrice(orderItem.getPrice());
            token.setQuantity(orderItem.getQuantity());
            token.setDescription(orderItem.getDescription());
            itemResponses.add(token);
        }
        return itemResponses;
    }
}
