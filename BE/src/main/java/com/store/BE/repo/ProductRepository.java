package com.store.BE.repo;

import com.store.BE.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = """
        SELECT COUNT(p) > 0
        FROM Product p
        WHERE p.name = :name
        """)
    Boolean existByName(String name);
}
