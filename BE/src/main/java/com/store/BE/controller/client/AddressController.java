package com.store.BE.controller.client;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    // Sử dụng RestTemplate để gọi API bên ngoài
    private final RestTemplate restTemplate = new RestTemplate();

    // 1. API lấy danh sách Tỉnh/Thành phố
    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        String url = "https://production.cas.so/address-kit/2025-07-01/provinces";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Lỗi khi gọi API Tỉnh/Thành phố\"}");
        }
    }

    // 2. API lấy danh sách Xã/Phường theo provinceId
    @GetMapping("/wards")
    public ResponseEntity<String> getWards(@RequestParam String provinceId) {
        String url = "https://production.cas.so/address-kit/2025-07-01/provinces/" + provinceId + "/communes";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Lỗi khi gọi API Xã/Phường\"}");
        }
    }
}