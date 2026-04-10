package com.store.BE.controller.client;

import com.store.BE.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
// ... (Các import khác giữ nguyên)

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    // ... (Giữ nguyên phần config @Value)

    @Autowired
    private OrderService orderService;

    // API IPN (Webhook) - VNPAY sẽ gọi ngầm API này
//    @GetMapping("/vnpay-ipn")
//    public ResponseEntity<?> vnpayIPN(HttpServletRequest request) {
//        try {
//            Map<String, String> fields = new HashMap<>();
//            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
//                String fieldName = params.nextElement();
//                String fieldValue = request.getParameter(fieldName);
//                if ((fieldValue != null) && (fieldValue.length() > 0)) {
//                    fields.put(fieldName, fieldValue);
//                }
//            }
//
//            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
//            fields.remove("vnp_SecureHashType");
//            fields.remove("vnp_SecureHash");
//
//            // Xác thực chữ ký
//            String signValue = VNPayUtil.hmacSHA512(secretKey, hashAllFields(fields));
//
//            if (signValue.equals(vnp_SecureHash)) {
//                String orderId = fields.get("vnp_TxnRef");
//                long vnpAmount = Long.parseLong(fields.get("vnp_Amount"));
//                String responseCode = fields.get("vnp_ResponseCode");
//
//                // Gọi Service cập nhật DB
//                boolean isUpdated = orderService.updatePaymentStatus(orderId, vnpAmount, responseCode);
//
//                if (isUpdated) {
//                    // Cập nhật thành công
//                    return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
//                } else {
//                    // Lỗi logic (Không tìm thấy đơn hoặc sai số tiền)
//                    return ResponseEntity.ok(Map.of("RspCode", "04", "Message", "Invalid Amount or Order not found"));
//                }
//            } else {
//                // Sai chữ ký (Có thể bị can thiệp dữ liệu)
//                return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown error"));
//        }
//    }
//
//    // ... (Giữ nguyên các hàm phụ trợ hashAllFields)
}