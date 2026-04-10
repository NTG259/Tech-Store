package com.store.BE.repository;

import com.store.BE.domain.dto.DayRevenueDTO;
import com.store.BE.domain.dto.MonthlyRevenueDTO;
import com.store.BE.domain.dto.WeekRevenueDTO;
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
                ORDER by month ASC;

            """, nativeQuery = true
    )
    List<MonthlyRevenueDTO> getMonthlyRevenueDTO(Integer year);

    @Query(
            value = """
                SELECT
                    WEEK(created_at, 1) AS week,
                    MIN(DATE(created_at)) AS startDate,
                    MAX(DATE(created_at)) AS endDate,
                    SUM(total_amount) AS total_revenue
                FROM orders
                WHERE status = 'CONFIRMED'
                    AND YEAR(created_at) = :year
                    AND MONTH(created_at) = :month
                GROUP BY WEEK(created_at, 1)
                ORDER BY week;
            """, nativeQuery = true
    )
    List<WeekRevenueDTO> getWeekRevenueDTO(Integer year, Integer month);

    @Query(
            value = """
                SELECT
                    day(created_at) AS day,
                    SUM(total_amount) AS total_revenue
                FROM orders
                WHERE status = 'CONFIRMED' and year(created_at) = :year and month(created_at) = :month and week(created_at, 1) = :week
                GROUP BY day(created_at)
                ORDER by day ASC;
            """, nativeQuery = true
    )
    List<DayRevenueDTO> getDayRevenueDTO(Integer year, Integer month, Integer week);
}
