package com.store.BE.repository;

import com.store.BE.domain.order.Order;
import com.store.BE.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable, Specification<Order> specification);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
