package com.store.BE.repository;

import com.store.BE.domain.dto.HotProductProjection;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Boolean existsByName(String name);

    @Modifying
    @Query(value = """
        UPDATE products 
        SET category_id = :uncategorizedId 
        WHERE category_id = :id
        """, nativeQuery = true)
    void updateCategory(@Param("id") Long id, @Param("uncategorizedId") Long uncategorizedId);

    List<Product> findTop5ByProductStatusOrderByCreatedAtDesc(ProductStatus status);

    @Query(value = """

            SELECT
                    p.id as productId,
                    p.name as productName,
                    p.product_img as productImg,
                    p.stock_quantity as stockQuantity,
                    SUM(o.quantity) as totalSold,
                    SUM(o.quantity * o.price) as totalRevenue
                FROM products p
                JOIN order_items o ON p.id = o.product_id
                GROUP BY p.id, p.name, p.product_img, p.stock_quantity
                ORDER BY totalRevenue DESC
                LIMIT 5
        """, nativeQuery = true)
    List<HotProductProjection> findTop5TopSoldProduct();

    @Query(value = """
            SELECT
                    *
                FROM products p
                WHERE p.is_hot = 1
        """, nativeQuery = true)
    List<Product> findHotProduct();
}
