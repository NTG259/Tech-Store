package com.store.BE.service;

import com.store.BE.domain.dto.HotProductProjection;
import com.store.BE.domain.response.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DashboardService {
    public DashboardResponse getSummary();
    public ApiResponse<List<HotProductProjection>> getTop10HotProduct();
    SummaryYearResponse getYearRevenue(Integer year);
    SummaryMonthlyResponse getMonthRevenue(Integer year, Integer month);
    SummaryWeekResponse getWeekRevenue(Integer year, Integer month, Integer week);
}
