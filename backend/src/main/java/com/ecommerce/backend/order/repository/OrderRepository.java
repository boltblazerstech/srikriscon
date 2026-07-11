package com.ecommerce.backend.order.repository;

import com.ecommerce.backend.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    boolean existsByUserId(Long userId);
    
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Order o SET o.user = null WHERE o.user.id = :userId")
    void unlinkUserOrders(@Param("userId") Long userId);

    Page<Order> findByStatus(Order.Status status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND (" +
           "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.shippingName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")")
    Page<Order> searchOrders(@Param("status") Order.Status status, @Param("search") String search, Pageable pageable);

    long countByCreatedAtAfter(LocalDateTime since);
    long countByStatus(Order.Status status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status <> 'CANCELLED' AND o.createdAt >= :since")
    BigDecimal sumRevenueSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = :status")
    BigDecimal sumRevenueByPaymentStatus(@Param("status") Order.PaymentStatus status);

    List<Order> findTop10ByOrderByCreatedAtDesc();
}
