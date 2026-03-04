package com.store.BE.controller;

import com.store.BE.domain.dto.CreateUserDTO;
import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // 1. Tạo người dùng mới
    @PostMapping("")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(
            @Valid @RequestBody CreateUserDTO createUserDTO) {
        ApiResponse<UserResponseDTO> response = this.userService.createUser(createUserDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Lấy thông tin chi tiết người dùng
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUser(@PathVariable Long id) {
        ApiResponse<UserResponseDTO> response = this.userService.getUserById(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 3. Cập nhật thông tin người dùng
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserDTO dto) {
        ApiResponse<UserResponseDTO> response = this.userService.updateUser(id, dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 4. Lấy danh sách tất cả người dùng
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
        ApiResponse<List<UserResponseDTO>> response = this.userService.getAllUsers();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // 5. Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        ApiResponse<Void> response = this.userService.deleteUser(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}