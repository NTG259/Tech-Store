package com.store.BE.service.implement;

import com.store.BE.domain.dto.DayRevenueDTO;
import com.store.BE.domain.dto.HotProductProjection;
import com.store.BE.domain.dto.MonthlyRevenueDTO;
import com.store.BE.domain.dto.WeekRevenueDTO;
import com.store.BE.domain.response.*;
import com.store.BE.repository.OrderRepository;
import com.store.BE.repository.ProductRepository;
import com.store.BE.repository.UserRepository;
import com.store.BE.service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardResponse getSummary() {
        DashboardResponse response = new DashboardResponse();
        Long totalUser = userRepository.count();
        Long totalOrder = orderRepository.count();
        Long totalProducts = productRepository.count();

        response.setUserCount(totalUser);
        response.setOrderSuccessCount(totalOrder);
        response.setProductCount(totalProducts);

        return response;

    }

    public ApiResponse<List<HotProductProjection>> getTop10HotProduct() {
        return new ApiResponse<>(
                productRepository.findTop5TopSoldProduct(),
                "Lấy top 10 sản phẩm bán đắt hàng thành công",
                null,
                HttpStatus.OK.value()
                );
    }

    public SummaryYearResponse getYearRevenue(Integer year) {
        List<MonthlyRevenueDTO> monthlyRevenueDTOList = orderRepository.getMonthlyRevenueDTO(year);
        SummaryYearResponse response = new SummaryYearResponse();
        response.setTotalRevenueMonth(monthlyRevenueDTOList);
        return response;
    }

    public SummaryMonthlyResponse getMonthRevenue(Integer year, Integer month) {
        List<WeekRevenueDTO> weekRevenueDTOS = orderRepository.getWeekRevenueDTO(year, month);
        SummaryMonthlyResponse response = new SummaryMonthlyResponse();
        response.setTotalRevenueWeek(weekRevenueDTOS);
        return response;
    }

    public SummaryWeekResponse getWeekRevenue(Integer year, Integer month, Integer week) {
        List<DayRevenueDTO> dayRevenueDTOS = orderRepository.getDayRevenueDTO(year, month, week);
        SummaryWeekResponse response = new SummaryWeekResponse();
        response.setTotalRevenueDay(dayRevenueDTOS);
        return response;
    }
}
