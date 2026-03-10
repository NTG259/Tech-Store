package com.store.BE.service.implement;

import com.store.BE.repository.ProductRepository;
import com.store.BE.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
}
