package com.store.BE.repository;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query(value = """
        SELECT COUNT(p) > 0
        FROM Product p
        WHERE p.name = :name
        """)
    Boolean existByName(String name);

    @Query(value = """
        SELECT p
        FROM Product p
        WHERE p.productStatus = :productStatus
        """)
    List<Product> findAllProductsIsPublishing(ProductStatus productStatus);

    Page<Product> findByProductStatus(ProductStatus status, Pageable pageable);

    @Modifying
    @Query("""
        UPDATE Product p
        SET p.category.id = :uncategorizedId
        WHERE p.category.id = :id
    """)
    void updateCategory(Long id, Long uncategorizedId);
}
