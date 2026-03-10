package com.store.BE.repository;

import com.store.BE.domain.product.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Boolean existsBySlug(String slug);
    Boolean existsByName(String name);
    Page<Category> findAll(Specification<Category> specification, Pageable pageable);
    Optional<Category> findBySlug(String slug);
}
