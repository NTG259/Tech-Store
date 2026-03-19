package com.store.BE.domain.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.store.BE.domain.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Order chứa item này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    private String name;

    private String productImg;

    // Số lượng
    private Long quantity;

    // Giá tại thời điểm mua
    private Long price;

    private String description;


}