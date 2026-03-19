package com.store.BE.domain.dto;
import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private Long quantity;
}