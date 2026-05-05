package com.ecommerce.backend.dashboard.service;

import com.ecommerce.backend.auth.repository.UserRepository;
import com.ecommerce.backend.category.repository.CategoryRepository;
import com.ecommerce.backend.dashboard.dto.DashboardStatsResponse;
import com.ecommerce.backend.order.dto.OrderResponse;
import com.ecommerce.backend.order.entity.Order;
import com.ecommerce.backend.order.repository.OrderRepository;
import com.ecommerce.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime epoch = LocalDateTime.of(2000, 1, 1, 0, 0);

        long totalOrders = orderRepository.count();
        long ordersToday = orderRepository.countByCreatedAtAfter(startOfToday);
        long pendingOrders = orderRepository.countByStatus(Order.Status.PLACED);

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (Order.Status s : Order.Status.values()) {
            ordersByStatus.put(s.name(), orderRepository.countByStatus(s));
        }

        BigDecimal revenueTotal = orderRepository.sumRevenueSince(epoch);
        BigDecimal revenueToday = orderRepository.sumRevenueSince(startOfToday);
        BigDecimal revenuePaid = orderRepository.sumRevenueByPaymentStatus(Order.PaymentStatus.PAID);

        long totalProducts = productRepository.countByDeletedAtIsNull();
        long outOfStock = productRepository.countByStockQuantityAndDeletedAtIsNull(0);

        long totalCategories = categoryRepository.count();

        long totalCustomers = userRepository.count();
        long newCustomersToday = userRepository.countByCreatedAtAfter(startOfToday);

        List<OrderResponse> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(OrderResponse::from).collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrders)
                .ordersToday(ordersToday)
                .pendingOrders(pendingOrders)
                .ordersByStatus(ordersByStatus)
                .revenueTotal(revenueTotal)
                .revenueToday(revenueToday)
                .revenuePaid(revenuePaid)
                .totalProducts(totalProducts)
                .outOfStockProducts(outOfStock)
                .totalCategories(totalCategories)
                .totalCustomers(totalCustomers)
                .newCustomersToday(newCustomersToday)
                .recentOrders(recentOrders)
                .build();
    }
}
