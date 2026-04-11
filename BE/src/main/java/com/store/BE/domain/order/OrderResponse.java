package com.store.BE.domain.order;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private String email;
    // Thông tin người nhận
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String note;

    // Thông tin đơn hàng
    private String paymentMethod;
    private String status;
    private Long totalAmount;
    private String paymentStatus;
    private Instant createdAt;

    // Danh sách sản phẩm trong đơn
    private List<OrderItemResponse> items;
}
