package com.store.BE.utils.specification;

import com.store.BE.domain.search.UserSearchRequest;
import com.store.BE.domain.user.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


public class UserSpecification {

    public static Specification<User> filter(UserSearchRequest req) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (req.getFullName() != null && !req.getFullName().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("fullName")),
                                req.getFullName().toLowerCase() + "%"
                        )
                );
            }

            if (req.getEmail() != null && !req.getEmail().isEmpty()) {
                predicates.add(
                        cb.equal(root.get("email"), req.getEmail())
                );
            }

            if (req.getStatus() != null && !req.getStatus().isEmpty()) {
                predicates.add(
                        cb.equal(root.get("status"), req.getStatus())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}