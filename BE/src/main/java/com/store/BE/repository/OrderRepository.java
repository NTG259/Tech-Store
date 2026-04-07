package com.store.BE.repository;

import com.store.BE.domain.dto.MonthlyRevenueDTO;
import com.store.BE.domain.order.Order;
import com.store.BE.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable, Specification<Order> specification);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    @Query(
            value = """
                SELECT
                    MONTH(created_at) AS month,
                    SUM(total_amount) AS total_revenue
                FROM orders
                WHERE status = 'CONFIRMED' and year(created_at) = :year
                GROUP BY MONTH(created_at)
                ORDER by month DESC;

            """, nativeQuery = true
    )
    List<MonthlyRevenueDTO> getMonthlyRevenueDTO(Integer year);
}
