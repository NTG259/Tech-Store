package com.store.BE.service.implement;

import com.store.BE.domain.dto.MonthlyRevenueDTO;
import com.store.BE.domain.order.OrderItem;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.DashboardResponse;
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

    public DashboardResponse getSummary(Integer year) {
        DashboardResponse response = new DashboardResponse();
        Long totalUser = userRepository.count();
        Long totalOrder = orderRepository.count();
        Long totalProducts = productRepository.count();
        List<MonthlyRevenueDTO> monthlyRevenueDTOList = orderRepository.getMonthlyRevenueDTO(year);

        response.setUserCount(totalUser);
        response.setOrderSuccessCount(totalOrder);
        response.setProductCount(totalProducts);
        response.setTotalRevenueMonthly(monthlyRevenueDTOList);

        return response;

    }

    public ApiResponse<List<OrderItem>> getTop10HotProduct() {
        return new ApiResponse<>(
                productRepository.findTop10HotProduct(),
                "Lấy top 10 sản phẩm bán đắt hàng thành công",
                null,
                HttpStatus.OK.value()
                );
    }
}
