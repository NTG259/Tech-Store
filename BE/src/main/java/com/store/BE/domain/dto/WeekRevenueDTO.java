package com.store.BE.domain.dto;

import java.time.LocalDate;

public interface WeekRevenueDTO {
    Integer getWeek();
    LocalDate getStartDate();
    LocalDate getEndDate();
    Long getTotalRevenue();
}

