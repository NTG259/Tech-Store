package com.store.BE.domain.order;
import lombok.Data;

@Data
public class OrderItemRequest {

    private String name;
    private String productImg;
    private Long productId;
    private Long quantity;
}