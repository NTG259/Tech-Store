package com.store.BE.controller.admin;

import com.store.BE.domain.order.OrderResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.OrderSearchRequest;
import com.store.BE.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping()
    public ResponseEntity<PaginationResponse<OrderResponse>> getAllOrdersPagination(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status
    ) {
        OrderSearchRequest request = new OrderSearchRequest(name, status);
        return ResponseEntity.ok().body(this.orderService.getAllOrdersByAdmin(request, PageRequest.of(page - 1, size)));
    }
}
