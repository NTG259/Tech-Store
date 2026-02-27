package com.store.BE.service;

import com.store.BE.domain.Product;
import com.store.BE.repo.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public Product createProduct(Product product) {
        return this.productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product's id not exist!");
        }
        product.setId(id);
        return this.productRepository.save(product);
    }

    public Product getProduct(Long id) {
        return this.productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product's id not exist!"));
    }

    public List<Product> getAllProducts() {
        return this.productRepository.findAll();
    }

    public void deleteProduct(Long id) {
        if (!this.productRepository.existsById(id)) {
            throw new RuntimeException("Product's id not exist!");
        }
        this.productRepository.deleteById(id);
    }
}
