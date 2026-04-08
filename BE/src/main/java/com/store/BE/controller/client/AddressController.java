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

    // 3. API lấy địa chỉ dựa trên tọa độ (Reverse Geocoding)
    @GetMapping("/nearby-address")
    public ResponseEntity<String> getNearbyAddress(@RequestParam double lat, @RequestParam double lng) {
        // Giả định URL endpoint của bên cung cấp dịch vụ
        String url = "https://production.cas.so/address-kit/2025-07-01/reverse-geocoding?lat=" + lat + "&lng=" + lng;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Không thể xác định địa chỉ từ tọa độ này\"}");
        }
    }
}