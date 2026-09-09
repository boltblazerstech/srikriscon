package com.ecommerce.backend.order.service;

import com.ecommerce.backend.auth.entity.User;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.common.exception.UnauthorizedException;
import com.ecommerce.backend.common.response.PagedResponse;
import com.ecommerce.backend.email.service.EmailService;
import com.ecommerce.backend.order.dto.OrderRequest;
import com.ecommerce.backend.order.dto.OrderResponse;
import com.ecommerce.backend.order.entity.Order;
import com.ecommerce.backend.order.entity.OrderItem;
import com.ecommerce.backend.order.repository.OrderRepository;
import com.ecommerce.backend.product.entity.Product;
import com.ecommerce.backend.product.entity.ProductVariant;
import com.ecommerce.backend.product.repository.ProductRepository;
import com.ecommerce.backend.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository         orderRepository;
    private final ProductRepository       productRepository;
    private final ProductVariantRepository variantRepository;
    private final EmailService            emailService;

    // ─── Place order ──────────────────────────────────────────────────────────

    @Transactional
    public OrderResponse placeOrder(User user, OrderRequest req) {
        List<OrderItem> items = req.getItems().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemReq.getProductId()));

            if (!product.isActive() || product.getDeletedAt() != null) {
                throw new BadRequestException("Product is not available: " + product.getName());
            }
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            if (itemReq.getQuantity() < product.getMinOrderQty()) {
                throw new BadRequestException(
                        "Minimum order quantity for " + product.getName() + " is " + product.getMinOrderQty());
            }

            // Resolve price: variant price if variantId provided, else product base price
            BigDecimal unitPrice = product.getPrice();
            Long variantId = null;
            String variantType = null;
            String variantValue = null;

            if (itemReq.getVariantId() != null) {
                ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                        .filter(v -> v.getProduct().getId().equals(product.getId()))
                        .orElseThrow(() -> new BadRequestException(
                                "Variant " + itemReq.getVariantId() + " does not belong to product " + product.getId()));
                if (!variant.isActive()) {
                    throw new BadRequestException("Variant is not available: " + variant.getValue());
                }
                unitPrice = variant.getPrice() != null ? variant.getPrice() : product.getPrice();
                variantId = variant.getId();
                variantType = variant.getType().name();
                variantValue = variant.getValue();
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .variantId(variantId)
                    .variantType(variantType)
                    .variantValue(variantValue)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .subtotal(subtotal)
                .totalAmount(subtotal)
                .shippingName(req.getShippingName())
                .shippingPhone(req.getShippingPhone())
                .shippingLine1(req.getShippingLine1())
                .shippingLine2(req.getShippingLine2())
                .shippingCity(req.getShippingCity())
                .shippingState(req.getShippingState())
                .shippingPostalCode(req.getShippingPostalCode())
                .shippingCountry(req.getShippingCountry())
                .notes(req.getNotes())
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "RAZORPAY")
                .build();

        items.forEach(item -> { item.setOrder(order); order.getItems().add(item); });
        Order saved = orderRepository.save(order);

        emailService.sendOrderPlaced(
                user.getEmail(),
                user.getFirstName(),
                saved.getOrderNumber(),
                saved.getTotalAmount().toPlainString());

        return OrderResponse.from(saved);
    }

    // ─── Customer queries ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> findByUser(Long userId, Pageable pageable) {
        return PagedResponse.of(orderRepository.findByUserId(userId, pageable), OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse findByIdForUser(Long id, User user) {
        Order order = getOrThrow(id);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }
        return OrderResponse.from(order);
    }

    // ─── Admin queries ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> findAll(Pageable pageable) {
        return PagedResponse.of(orderRepository.findAll(pageable), OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> findByStatus(String status, Pageable pageable) {
        Order.Status s = parseStatus(status);
        return PagedResponse.of(orderRepository.findByStatus(s, pageable), OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> findAllAdmin(String status, String search, Pageable pageable) {
        Order.Status s = (status != null && !status.isBlank()) ? parseStatus(status) : null;

        Page<Order> page;
        if (search != null && !search.isBlank()) {
            page = orderRepository.searchOrders(s, search.trim(), pageable);
        } else if (s != null) {
            page = orderRepository.findByStatus(s, pageable);
        } else {
            page = orderRepository.findAll(pageable);
        }

        return PagedResponse.of(page, OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return OrderResponse.from(getOrThrow(id));
    }

    // ─── Status update (admin) ────────────────────────────────────────────────

    @Transactional
    public OrderResponse updateStatus(Long id, String statusStr) {
        Order order = getOrThrow(id);
        Order.Status newStatus = parseStatus(statusStr);
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        User user = saved.getUser();
        emailService.sendOrderStatusChanged(
                user.getEmail(), user.getFirstName(),
                saved.getOrderNumber(), newStatus.name());

        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse markPaidManually(Long id) {
        Order order = getOrThrow(id);
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        if (order.getStatus() == Order.Status.PLACED) {
            order.setStatus(Order.Status.CONFIRMED);
        }
        Order saved = orderRepository.save(order);

        try {
            User user = saved.getUser();
            emailService.sendPaymentConfirmed(
                    user.getEmail(), user.getFirstName(),
                    saved.getOrderNumber(), saved.getTotalAmount().toPlainString());
        } catch (Exception e) {
            // Ignore email errors to not block transaction
        }

        return OrderResponse.from(saved);
    }

    // ─── Cancel ───────────────────────────────────────────────────────────────

    /** Customer self-cancel: only allowed when order is PLACED (before payment). */
    @Transactional
    public OrderResponse cancelByCustomer(Long id, User user) {
        Order order = getOrThrow(id);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }
        if (order.getStatus() != Order.Status.PLACED) {
            throw new BadRequestException(
                    "Order can only be cancelled before payment is made (current status: " + order.getStatus() + ")");
        }
        return doCancel(order, user);
    }

    /** Admin cancel: allowed for any status except DELIVERED. */
    @Transactional
    public OrderResponse cancelByAdmin(Long id) {
        Order order = getOrThrow(id);
        if (order.getStatus() == Order.Status.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order");
        }
        return doCancel(order, order.getUser());
    }

    private OrderResponse doCancel(Order order, User user) {
        restoreStock(order);
        order.setStatus(Order.Status.CANCELLED);
        Order saved = orderRepository.save(order);
        emailService.sendOrderCancelled(user.getEmail(), user.getFirstName(), saved.getOrderNumber());
        return OrderResponse.from(saved);
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    /** Called by PaymentService after successful payment. */
    @Transactional
    public void markPaid(Long orderId) {
        Order order = getOrThrow(orderId);
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setStatus(Order.Status.CONFIRMED);
        Order saved = orderRepository.save(order);
        User user = saved.getUser();
        emailService.sendPaymentConfirmed(
                user.getEmail(), user.getFirstName(),
                saved.getOrderNumber(), saved.getTotalAmount().toPlainString());
    }

    /** Called by PaymentService on payment failure. */
    @Transactional
    public void markPaymentFailed(Long orderId) {
        Order order = getOrThrow(orderId);
        order.setPaymentStatus(Order.PaymentStatus.FAILED);
        orderRepository.save(order);
    }

    /** Called by PaymentService after refund is issued. */
    @Transactional
    public void markRefunded(Long orderId) {
        Order order = getOrThrow(orderId);
        order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        order.setStatus(Order.Status.REFUNDED);
        restoreStock(order);
        Order saved = orderRepository.save(order);
        emailService.sendOrderStatusChanged(
                saved.getUser().getEmail(), saved.getUser().getFirstName(),
                saved.getOrderNumber(), "REFUNDED");
    }

    /** Called by ShiprocketService after shipment is created and AWB assigned. */
    @Transactional
    public void updateShipmentInfo(Long orderId, String awbCode, String shiprocketShipmentId) {
        Order order = getOrThrow(orderId);
        order.setAwbCode(awbCode);
        order.setShiprocketShipmentId(shiprocketShipmentId);
        order.setStatus(Order.Status.SHIPPED);
        Order saved = orderRepository.save(order);
        User user = saved.getUser();
        emailService.sendOrderShipped(
                user.getEmail(), user.getFirstName(), saved.getOrderNumber(), null);
    }

    private void restoreStock(Order order) {
        order.getItems().forEach(item -> {
            productRepository.findById(item.getProductId()).ifPresent(p -> {
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                productRepository.save(p);
            });
        });
    }

    private Order getOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    private Order.Status parseStatus(String status) {
        try {
            return Order.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
    }

    private String generateOrderNumber() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        int rnd = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ORD-" + ts + "-" + rnd;
    }
}
