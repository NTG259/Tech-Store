package com.store.BE.domain.dto;

import com.store.BE.domain.product.Category;
import com.store.BE.domain.product.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 255)
    private String name;

    @Positive(message = "Price must be greater than 0")
    private Long price;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private int stockQuantity;

    @Size(max = 1000)
    private String description;

    @NotBlank(message = "Brand must not be blank")
    private String brand;

    private String productImg;

    private ProductStatus productStatus = ProductStatus.PUBLISHED;

    private Long categoryId;

    private Category category;
}
