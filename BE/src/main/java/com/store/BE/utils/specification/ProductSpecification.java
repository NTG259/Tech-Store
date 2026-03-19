package com.store.BE.utils.specification;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.product.ProductStatus;
import com.store.BE.domain.search.ProductSearchRequest;
import com.store.BE.domain.search.UserSearchRequest;
import com.store.BE.domain.user.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> filter(ProductSearchRequest req) {
                            // where name = ... and category = ...
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (req.getName() != null && !req.getName().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + req.getName().toLowerCase() + "%"
                        )
                        // where name like %t%en
                );
            }

            if (req.getCategoryId() != null) {
                if (req.getCategoryId() < 0) {
                    predicates.add(
                            cb.equal(
                                    root.get("category"),
                                    null
                            )
                    );
                } else {
                    predicates.add(
                            cb.equal(
                                    root.get("category").get("id"),
                                    req.getCategoryId()
                            )
                    );
                }
            }
            // where cate = ...
            if (req.getProductStatus() != null && !req.getProductStatus().isBlank()) {
                predicates.add(cb.equal(root.get("productStatus"), ProductStatus.valueOf(req.getProductStatus())));
            }

            if (req.getMinPrice() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("price"),
                                req.getMinPrice()
                        )
                );
            }

            // filter theo giá <= maxPrice
            if (req.getMaxPrice() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("price"),
                                req.getMaxPrice()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
