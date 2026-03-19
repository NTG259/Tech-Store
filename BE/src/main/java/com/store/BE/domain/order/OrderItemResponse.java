package com.store.BE.domain.order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long productId;

    private String productName;

    private String productImg;

    private Long price;

    private Long quantity;

    private String description;

}