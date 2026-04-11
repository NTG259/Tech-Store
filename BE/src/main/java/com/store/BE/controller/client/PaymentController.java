package com.store.BE.controller.client;

import com.store.BE.domain.order.OrderResponse;
import com.store.BE.domain.order.PaymentStatus;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.service.OrderService;
import com.store.BE.service.VNPayService;
import com.store.BE.service.implement.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment/vnpay")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;
    private final OrderService orderService;
    private final CartService cartService;
    /**
     * API 1: Tạo URL thanh toán
     * Client sẽ gọi API này, nhận về URL và redirect user sang trang VNPay
     */
    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(HttpServletRequest request,
                                           @RequestParam double amount,
                                           @RequestParam String paymentRef) {
        try {
            String ipAddress = vnPayService.getIpAddress(request);
            String paymentUrl = vnPayService.generateVNPayURL(amount, paymentRef, ipAddress);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);

        } catch (UnsupportedEncodingException e) {
            return ResponseEntity.badRequest().body("Lỗi tạo URL thanh toán: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> fields) {

        // 1. Verify chữ ký
        boolean isValidSignature = vnPayService.verifyTransaction(fields);

        if (!isValidSignature) {
            return ResponseEntity.badRequest().body("Chữ ký không hợp lệ");
        }

        String orderId = fields.get("vnp_TxnRef");
        String responseCode = fields.get("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            orderService.updatePayment(Long.valueOf(orderId), PaymentStatus.PAID);

            cartService.removeCart(
                    orderService.getOrderById(Long.valueOf(orderId)).getUser().getId()
            );

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "orderId", orderId
            ));
        } else {
            ApiResponse<OrderResponse> response = orderService.updatePayment(Long.valueOf(orderId), PaymentStatus.FAILED);
            return ResponseEntity.ok(Map.of(
                    "status", "failed",
                    "orderId", orderId
            ));
        }
    }
}