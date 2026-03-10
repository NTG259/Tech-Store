package com.store.BE.utils.exception;

import com.store.BE.domain.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

    // Xử lý lỗi hệ thống chưa xác định
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleSystemException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(
                        null,
                        ErrorCode.INTERNAL_SERVER_ERROR.getMessage(),
                        ErrorCode.INTERNAL_SERVER_ERROR.name(),
                        ErrorCode.INTERNAL_SERVER_ERROR.getStatus().value()
                ));
    }

    // Xử lý lỗi Business
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(new ApiResponse<>(
                        null,
                        errorCode.getMessage(),
                        errorCode.name(),
                        errorCode.getStatus().value()
                ));
    }

    // Xử lý lỗi không tìm thấy Endpoint (404)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleEndPointNotFound(NoResourceFoundException ex) {
        return ResponseEntity.status(ErrorCode.ENDPOINT_NOT_FOUND.getStatus())
                .body(new ApiResponse<>(
                        null,
                        ErrorCode.ENDPOINT_NOT_FOUND.getMessage(),
                        ErrorCode.ENDPOINT_NOT_FOUND.name(),
                        ErrorCode.ENDPOINT_NOT_FOUND.getStatus().value()));
    }

    // Xử lý lỗi sai phương thức HTTP (GET/POST/PUT/DELETE)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(new ApiResponse<>(
                        null,
                        "Phương thức HTTP không được hỗ trợ",
                        ex.getMessage(),
                        HttpStatus.METHOD_NOT_ALLOWED.value()));
    }

    // Xử lý lỗi Validation (@Valid trên DTO) - Rất quan trọng cho Frontend
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        fieldErrors.put(error.getField(), error.getDefaultMessage())
                );
        ErrorCode errorCode = ErrorCode.VALIDATION_ERROR;

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(new ApiResponse<>(
                        null,
                        errorCode.getMessage(),
                        Map.of(
                                "code", errorCode.name(),
                                "fields", fieldErrors
                        ),
                        errorCode.getStatus().value()
                ));
    }

    // Xử lý lỗi Constraint (ví dụ: @Min, @Max trực tiếp trên tham số Controller)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                errors.put(violation.getPropertyPath().toString(), violation.getMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(null, "Vi phạm ràng buộc dữ liệu", errors, HttpStatus.BAD_REQUEST.value()));
    }

    // Xử lý lỗi Database (Duplicate Key, Foreign Key...)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        // Có thể phân tích ex.getRootCause().getMessage() để biết cụ thể là lỗi trùng Email hay lỗi khác
        String message = "Dữ liệu bị trùng lặp hoặc vi phạm liên kết hệ thống";
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(null, message, ex.getMostSpecificCause().getMessage(), HttpStatus.CONFLICT.value()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> badCredential(BadCredentialsException ex) {
        return ResponseEntity.status(ErrorCode.BAD_CREDENTIALS.getStatus())
                .body(new ApiResponse<>(
                        null,
                        ErrorCode.BAD_CREDENTIALS.getMessage(),
                        ErrorCode.BAD_CREDENTIALS.name(),
                        ErrorCode.BAD_CREDENTIALS.getStatus().value()));
    }

}