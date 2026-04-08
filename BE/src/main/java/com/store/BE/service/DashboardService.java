package com.store.BE.service;

import com.store.BE.domain.dto.HotProductProjection;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.DashboardResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DashboardService {
    public DashboardResponse getSummary(Integer year);
    public ApiResponse<List<HotProductProjection>> getTop10HotProduct();
}
