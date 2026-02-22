package com.store.BE.utils;

import com.store.BE.domain.response.RestResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler({RuntimeException.class, DataIntegrityViolationException.class})
    public ResponseEntity<RestResponse<Object>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestResponse.of(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null));
    }

}
