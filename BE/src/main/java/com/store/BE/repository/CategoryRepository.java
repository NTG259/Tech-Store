package com.store.BE.repository;

import com.store.BE.domain.product.Category;
import com.store.BE.domain.product.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Boolean existsBySlug(String slug);
    Boolean existsByName(String name);
    Page<Category> findAll(Specification<Category> specification, Pageable pageable);
    Optional<Category> findBySlug(String slug);
    @Query(value = """
    SELECT 
        c.id AS id,
        c.name AS name,
        c.slug AS slug,

        COUNT(DISTINCT p.id) AS totalProducts,
        COALESCE(SUM(oi.quantity), 0) AS totalSold,
        COALESCE(SUM(oi.quantity * oi.price), 0) AS totalRevenue

    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    LEFT JOIN order_items oi ON oi.product_id = p.id

    WHERE 1=1
        AND (:name IS NULL OR c.name LIKE %:name%)

    GROUP BY c.id, c.name, c.slug

    ORDER BY
        CASE WHEN :sortBy = 'totalProducts' AND :direction = 'asc' THEN COUNT(DISTINCT p.id) END ASC,
        CASE WHEN :sortBy = 'totalProducts' AND :direction = 'desc' THEN COUNT(DISTINCT p.id) END DESC,

        CASE WHEN :sortBy = 'totalSold' AND :direction = 'asc' THEN SUM(oi.quantity) END ASC,
        CASE WHEN :sortBy = 'totalSold' AND :direction = 'desc' THEN SUM(oi.quantity) END DESC,

        CASE WHEN :sortBy = 'totalRevenue' AND :direction = 'asc' THEN SUM(oi.quantity * oi.price) END ASC,
        CASE WHEN :sortBy = 'totalRevenue' AND :direction = 'desc' THEN SUM(oi.quantity * oi.price) END DESC
    """,
            countQuery = """
                SELECT COUNT(*) FROM categories c
                WHERE (:name IS NULL OR c.name LIKE %:name%)
    """,
            nativeQuery = true)
    Page<CategoryResponse> getCategories(
            @Param("name") String name,
            @Param("sortBy") String sortBy,
            @Param("direction") String direction,
            Pageable pageable
    );

    @Query(value = """
    SELECT 
        c.id AS id,
        c.name AS name,
        c.slug AS slug,

        COUNT(DISTINCT p.id) AS totalProducts,

        COALESCE(SUM(oi.quantity), 0) AS totalSold,

        COALESCE(SUM(oi.quantity * oi.price), 0) AS totalRevenue

    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    LEFT JOIN order_items oi ON oi.product_id = p.id

    GROUP BY c.id, c.name, c.slug
""", nativeQuery = true)
    List<CategoryResponse> getCategoryStatistics();
}
