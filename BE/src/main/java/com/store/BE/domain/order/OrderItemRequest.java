package com.store.BE.domain.order;
import lombok.Data;

@Data
public class OrderItemRequest {

    private Long productId;
    private Long quantity;
}