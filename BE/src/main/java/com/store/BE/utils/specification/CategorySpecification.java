package com.store.BE.utils.specification;

import com.store.BE.domain.product.Category;
import com.store.BE.domain.search.CategorySearchRequest;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.domain.user.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CategorySpecification {
    public static Specification<Category> filter(CategorySearchRequest req) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (req.getName() != null && !req.getName().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + req.getName().toLowerCase() + "%"
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
