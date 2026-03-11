package com.store.BE.controller.admin;

import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.DashboardResponse;
import com.store.BE.service.OrderService;
import com.store.BE.service.ProductService;
import com.store.BE.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary() {
        DashboardResponse dashboardResponse = new DashboardResponse();
        dashboardResponse.setUserCount(userService.totalUser());
        dashboardResponse.setProductCount(productService.productCount());
        dashboardResponse.setOrderSuccessCount(orderService.totalSuccessOrder());
        dashboardResponse.setTotalRevenue(orderService.totalRevenue());

        ApiResponse<DashboardResponse> rs = new ApiResponse<>(
                dashboardResponse,
                "Thống kê thành công",
                null,
                HttpStatus.OK.value()
        );

        return ResponseEntity.ok().body(rs);
    }
}
