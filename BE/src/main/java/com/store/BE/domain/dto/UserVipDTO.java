package com.store.BE.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public interface UserVipDTO {
    Long getId();
    String getFullName();
    String getEmail();
    Double getTotalSpend();
    Long getTotalOrder();
}