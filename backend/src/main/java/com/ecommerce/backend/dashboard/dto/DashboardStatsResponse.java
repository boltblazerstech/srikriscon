package com.ecommerce.backend.dashboard.dto;

import com.ecommerce.backend.order.dto.OrderResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsResponse {

    // Orders
    private long totalOrders;
    private long ordersToday;
    private long pendingOrders;
    private Map<String, Long> ordersByStatus;

    // Revenue
    private BigDecimal revenueTotal;
    private BigDecimal revenueToday;
    private BigDecimal revenuePaid;

    // Products
    private long totalProducts;
    private long outOfStockProducts;

    // Categories
    private long totalCategories;

    // Customers
    private long totalCustomers;
    private long newCustomersToday;

    // Recent activity
    private List<OrderResponse> recentOrders;
}
