package com.store.BE.utils.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    //AUTH
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "Bạn không có quyền truy cập"),

    // DATA
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email đã được sử dụng"),
    NAME_ALREADY_EXIST(HttpStatus.CONFLICT, "Tên sản phẩm đã được sử dụng"),
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"),

    //VALIDATION
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Dữ liệu đầu vào không hợp lệ"),

    // SYSTEM
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Hệ thống gặp lỗi không mong muốn"),
    ENDPOINT_NOT_FOUND(HttpStatus.NOT_FOUND, "Đường dẫn không hợp lệ"),
    ;

    private final HttpStatus status;
    private final String message;
    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}