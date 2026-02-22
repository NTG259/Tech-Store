package com.store.BE.domain.response;

public record RestResponse<T> (int status, String message, T data) {
    public static <T> RestResponse<T> success(T data) {
        return new RestResponse<>(200, "Success", data);
    }

    public static <T> RestResponse<T> of(int status, String message, T data) {
        return new RestResponse<>(status, message, data);
    }
}