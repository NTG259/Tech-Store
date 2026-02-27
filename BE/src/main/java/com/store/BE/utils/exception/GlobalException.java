package com.store.BE.utils.exception;

import com.store.BE.domain.response.RestResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler({RuntimeException.class, DataIntegrityViolationException.class})
    public ResponseEntity<RestResponse<Object>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestResponse.of(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null));
    }

    @ExceptionHandler({NoResourceFoundException.class, HttpRequestMethodNotSupportedException.class})
    public ResponseEntity<RestResponse<Object>> apiNotSupport(Exception ex) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(RestResponse.of(HttpStatus.NO_CONTENT.value(), "Đã có lỗi xảy ra", null));
    }

}
