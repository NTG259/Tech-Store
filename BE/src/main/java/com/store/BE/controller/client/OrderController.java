package com.store.BE.controller.client;

import com.store.BE.domain.order.Order;
import com.store.BE.domain.order.OrderResponse;
import com.store.BE.domain.order.OrderStatus;
import com.store.BE.domain.order.OrderStatusRequest;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.OrderSearchRequest;
import com.store.BE.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/client/orders")
public class OrderController {
    private final OrderService orderService;

    @GetMapping()
    public ResponseEntity<PaginationResponse<OrderResponse>> getAllOrdersPagination(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam(value = "status", required = false) String status
    ) {
        OrderSearchRequest request = new OrderSearchRequest();
        request.setName("");
        request.setStatus(status);
        return ResponseEntity.ok().body(this.orderService.getAllOrdersByClient(request, PageRequest.of(page - 1, size)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(
            @PathVariable Long id, @RequestBody OrderStatusRequest orderStatus) {
        return ResponseEntity.ok()
                .body(this.orderService.updateOrder(
                        id, OrderStatus.valueOf(orderStatus.getStatus())));
    }

}
