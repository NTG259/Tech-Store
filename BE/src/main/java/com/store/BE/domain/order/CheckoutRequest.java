package com.store.BE.domain.order;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {

    private String shippingAddress;
    private String receiverName;
    private String phone;
    private String paymentMethod;
    private String note;

    private List<OrderItemRequest> items;
}