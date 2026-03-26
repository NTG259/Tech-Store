package com.store.BE.controller.admin;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.DashboardResponse;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary(@RequestParam Integer year) {
        DashboardResponse dashboardResponse = dashboardService.getSummary(year);
        ApiResponse<DashboardResponse> rs = new ApiResponse<>(
                dashboardResponse,
                "Thống kê thành công",
                null,
                HttpStatus.OK.value()
        );

        return ResponseEntity.ok().body(rs);
    }
}
