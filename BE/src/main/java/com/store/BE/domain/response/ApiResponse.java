package com.store.BE.domain.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public record ApiResponse<T>(
        T data,
        String message,
        Object errors,
        int status
) {}
