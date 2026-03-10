package com.store.BE.controller.client;

import com.store.BE.domain.dto.UpdateUserDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.service.UserService;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.security.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@AllArgsConstructor
@Validated
public class ProfileController {
    private final UserService userService;

    private Long getCurrentUserId() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_CREDENTIALS));

        return userService.handleFindUserByEmail(email).getId();
    }
    // Lấy thông tin tài khoản
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getAccount() {
        ApiResponse<UserResponseDTO> response = this.userService.getUserById(getCurrentUserId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    // Cập nhật tài khoản
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateAccount(
            @RequestBody UpdateUserDTO dto) {
        ApiResponse<UserResponseDTO> response = this.userService.updateUser(getCurrentUserId(), dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }


    // Khóa / xóa tài khoản
    @DeleteMapping("/locked")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        ApiResponse<Void> response = this.userService.disableAccount(getCurrentUserId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}