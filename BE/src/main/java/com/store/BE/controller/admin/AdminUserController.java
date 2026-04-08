package com.store.BE.controller.admin;

import com.store.BE.domain.dto.CreateUserByAdminDTO;
import com.store.BE.domain.dto.UpdateUserByAdminDTO;
import com.store.BE.domain.dto.UserVipDTO;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.response.UserResponseDTO;
import com.store.BE.domain.search.UserSearchRequest;
import com.store.BE.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final UserService userService;

    // Tạo người dùng mới bởi Admin (có quyền set Role)
    @PostMapping("")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUserByAdmin(
            @Valid @RequestBody CreateUserByAdminDTO dto) {
        ApiResponse<UserResponseDTO> response = this.userService.createUserByAdmin(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Cập nhật thông tin người dùng bởi Admin (có quyền update Role)
    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUserByAdmin(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserByAdminDTO dto) {
        ApiResponse<UserResponseDTO> response = this.userService.updateUserByAdmin(id, dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    //Lấy danh sách tất cả người dùng
//    @GetMapping("")
//    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
//        ApiResponse<List<UserResponseDTO>> response = this.userService.getAllUsers();
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(response);
//    }

    //Phân trang danh sách người dùng
    @GetMapping(params = {"page", "size", "fullName"})
    public ResponseEntity<PaginationResponse<UserResponseDTO>> getAllUsersPagination(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @RequestParam("fullName") String fullName
    ) {
        UserSearchRequest request = new UserSearchRequest();
        request.setFullName(fullName);
        Pageable pageable = PageRequest.of(page - 1, size);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.userService.getAllUsersPagination(request, pageable));
    }

    // Khóa / xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        ApiResponse<Void> response = this.userService.deleteUser(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<ApiResponse<Void>> lockUser(@PathVariable Long id) {
        ApiResponse<Void> response = this.userService.disableAccount(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping("/vip")
    public ResponseEntity<ApiResponse<List<UserVipDTO>>> getTop5UserVip() {
        return ResponseEntity.ok().body(
                this.userService.getTop5UserVip()
        );
    }
}
