package com.store.BE.controller.admin;

import com.store.BE.domain.dto.HotProductProjection;
import com.store.BE.domain.order.OrderItem;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.*;
import com.store.BE.service.DashboardService;
import com.store.BE.service.OrderService;
import com.store.BE.service.ProductService;
import com.store.BE.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary() {
        DashboardResponse dashboardResponse = dashboardService.getSummary();
        ApiResponse<DashboardResponse> rs = new ApiResponse<>(
                dashboardResponse,
                "Thống kê thành công",
                null,
                HttpStatus.OK.value()
        );

        return ResponseEntity.ok().body(rs);
    }

    @GetMapping("/dashboard/year-revenue")
    public ResponseEntity<ApiResponse<SummaryYearResponse>> getSummaryYear(
            @RequestParam Integer year) {
            ApiResponse<SummaryYearResponse> rs = new ApiResponse<>(
                this.dashboardService.getYearRevenue(year),
                "Thống kê trong năm theo 12 tháng",
                null,
                HttpStatus.OK.value()
                );
            return ResponseEntity.ok().body(rs);
    }

    @GetMapping("/dashboard/month-revenue")
    public ResponseEntity<ApiResponse<SummaryMonthlyResponse>> getSummaryMonth(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        ApiResponse<SummaryMonthlyResponse> rs = new ApiResponse<>(
                this.dashboardService.getMonthRevenue(year, month),
                "Thống kê trong tháng theo 4 tuần",
                null,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok().body(rs);
    }

    @GetMapping("/dashboard/week-revenue")
    public ResponseEntity<ApiResponse<SummaryWeekResponse>> getSummaryWeekly(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam Integer week) {
        ApiResponse<SummaryWeekResponse> rs = new ApiResponse<>(
                this.dashboardService.getWeekRevenue(year, month, week),
                "Thống kê trong tuần theo 7 ngày",
                null,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok().body(rs);
    }

    @GetMapping("/dashboard/hot-products")
    public ResponseEntity<ApiResponse<List<HotProductProjection>>> getTop10HotProduct() {
        ApiResponse<List<HotProductProjection>> rs = dashboardService.getTop10HotProduct();
        return ResponseEntity.ok().body(rs);
    }
}
