package com.store.BE.domain;

import com.store.BE.domain.status.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255)
    private String name;

    @Positive(message = "Price must be greater than 0")
    private double price;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private int stockQuantity;

    @Size(max = 1000)
    private String description;

    @NotBlank(message = "Brand must not be blank")
    private String brand;

    private String productImg;

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus = ProductStatus.available;
}