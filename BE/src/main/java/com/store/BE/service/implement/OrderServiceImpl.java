package com.store.BE.service.implement;


import com.store.BE.domain.order.*;
import com.store.BE.domain.product.Product;
import com.store.BE.domain.response.ApiResponse;
import com.store.BE.domain.response.PaginationResponse;
import com.store.BE.domain.search.OrderSearchRequest;
import com.store.BE.domain.user.User;
import com.store.BE.repository.OrderRepository;
import com.store.BE.repository.ProductRepository;
import com.store.BE.repository.UserRepository;
import com.store.BE.service.OrderService;
import com.store.BE.utils.convert.OrderConvert;
import com.store.BE.utils.convert.PaginationUtil;
import com.store.BE.utils.exception.BusinessException;
import com.store.BE.utils.exception.ErrorCode;
import com.store.BE.utils.security.SecurityUtils;
import com.store.BE.utils.specification.OrderSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public PaginationResponse<OrderResponse> getAllOrdersByClient(OrderSearchRequest request, Pageable pageable) {
        User user = this.userRepository.findByEmail(SecurityUtils.getCurrentUserLogin()
                        .orElseThrow(() -> new BusinessException(ErrorCode.BAD_CREDENTIALS)))
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Specification<Order> userSpec = (root, query, cb) -> cb.equal(root.get("user"), user);

        Specification<Order> finalSpec = userSpec.and(OrderSpecification.filter(request));

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Order> orderPage = this.orderRepository.findAll(finalSpec, sortedPageable);
        Page<OrderResponse> responses = orderPage.map(OrderConvert::convertToOrderResponse);
        return PaginationUtil.convertResponse(responses);
    }

    public PaginationResponse<OrderResponse> getAllOrdersByAdmin(OrderSearchRequest request, Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Specification<Order> specification = OrderSpecification.filter(request);
        Page<Order> orderPage = this.orderRepository.findAll(specification, sortedPageable);
        Page<OrderResponse> responses = orderPage.map(OrderConvert::convertToOrderResponse);
        return PaginationUtil.convertResponse(responses);
    }

    @Transactional
    public ApiResponse<Order> checkout(CheckoutRequest request) {
        // 1. Lấy thông tin user hiện tại từ Security context
        String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đăng nhập!"));

        User currentUser = userRepository.findByEmail(currentUserLogin) // Hoặc findByUsername tùy hệ thống của bạn
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));

        // 2. Khởi tạo Order
        Order order = new Order();
        order.setUser(currentUser);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        order.setStatus(OrderStatus.PENDING); // Đặt trạng thái mặc định là chờ xử lý

        // 3. Xử lý Order Items và tính toán tổng tiền (Total Amount)
        long totalAmount = 0L;

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm có ID " + itemReq.getProductId() + " không tồn tại!"));

            // Tùy chọn: Thêm logic kiểm tra số lượng tồn kho (product.getStock() < itemReq.getQuantity()) ở đây

            // Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Set quan hệ 2 chiều
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(product.getPrice()); // Lưu lại giá tại thời điểm mua
            orderItem.setDescription(product.getDescription());
            orderItems.add(orderItem);

            // Tính tổng tiền cho item này: (giá * số lượng) và cộng vào tổng đơn
            long itemTotal = product.getPrice() * itemReq.getQuantity();
            totalAmount = totalAmount + itemTotal;
        }

        // 4. Gắn dữ liệu vào Order
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // 5. Lưu Order vào Database
        // Vì class Order có CascadeType.ALL ở mappedBy="order", các OrderItem sẽ được tự động lưu theo.
        return new ApiResponse<>(
                orderRepository.save(order),
                "Tạo đơn hàng thành công",
                null,
                HttpStatus.CREATED.value());
    }

    @Override
    public ApiResponse<OrderResponse> updateOrder(Long orderId, OrderStatus orderStatus) {
        Order updateOrder = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND));
        updateOrder.setStatus(orderStatus);
        updateOrder = this.orderRepository.save(updateOrder);
        return new ApiResponse<>(
                OrderConvert.convertToOrderResponse(updateOrder),
                "Cập nhật đơn hàng thành công",
                null,
                HttpStatus.OK.value()
        );
    }
}
