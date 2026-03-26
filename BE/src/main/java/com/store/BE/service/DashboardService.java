package com.store.BE.service;

import com.store.BE.domain.response.DashboardResponse;
import org.springframework.stereotype.Service;

@Service
public interface DashboardService {
    public DashboardResponse getSummary(Integer year);
}
