package com.store.BE.utils.specification;

import com.store.BE.domain.order.Order;
import com.store.BE.domain.order.OrderStatus;
import com.store.BE.domain.order.PaymentStatus;
import com.store.BE.domain.search.OrderSearchRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    public static Specification<Order> filter(OrderSearchRequest req) {

        return (root, query, cb) -> {

            if (req == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (req.getName() != null && !req.getName().trim().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("receiverName")),
                                "%" + req.getName().trim().toLowerCase() + "%"
                        )
                );
            }

            if (req.getStatus() != null && !req.getStatus().isEmpty()) {
                predicates.add(
                        cb.equal(
                                root.get("status"), OrderStatus.valueOf(req.getStatus())
                        )
                );
            }

            predicates.add(
                    cb.notEqual(
                            root.get("paymentStatus"), PaymentStatus.FAILED
                    )
            );

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}