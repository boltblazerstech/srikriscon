package com.ecommerce.backend.payment.service;

import com.ecommerce.backend.common.config.RazorpayProperties;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.order.entity.Order;
import com.ecommerce.backend.order.repository.OrderRepository;
import com.ecommerce.backend.order.service.OrderService;
import com.ecommerce.backend.payment.dto.PaymentInitResponse;
import com.ecommerce.backend.payment.dto.PaymentVerifyRequest;
import com.ecommerce.backend.payment.entity.Payment;
import com.ecommerce.backend.payment.repository.PaymentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository   paymentRepository;
    private final OrderRepository     orderRepository;
    private final OrderService        orderService;
    private final RazorpayProperties  razorpayProperties;
    private final ObjectMapper        objectMapper;

    // ─── Initiate payment ─────────────────────────────────────────────────────

    @Transactional
    public PaymentInitResponse initiatePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            throw new BadRequestException("Order is already paid");
        }

        try {
            RazorpayClient client = new RazorpayClient(
                    razorpayProperties.getKeyId(), razorpayProperties.getKeySecret());

            int amountInPaise = order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100)).intValue();

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", razorpayProperties.getCurrency());
            options.put("receipt", order.getOrderNumber());

            com.razorpay.Order razorpayOrder = client.orders.create(options);
            String rzpOrderId = razorpayOrder.get("id");

            Payment payment = Payment.builder()
                    .order(order)
                    .razorpayOrderId(rzpOrderId)
                    .amount(order.getTotalAmount())
                    .currency(razorpayProperties.getCurrency())
                    .status(Payment.Status.PENDING)
                    .build();
            paymentRepository.save(payment);

            return PaymentInitResponse.builder()
                    .razorpayOrderId(rzpOrderId)
                    .amount(order.getTotalAmount())
                    .currency(razorpayProperties.getCurrency())
                    .keyId(razorpayProperties.getKeyId())
                    .build();

        } catch (RazorpayException e) {
            throw new BadRequestException("Payment initiation failed: " + e.getMessage());
        }
    }

    // ─── Verify payment (client-side callback) ────────────────────────────────

    @Transactional
    public void verifyPayment(PaymentVerifyRequest req) {
        Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment",
                        "razorpayOrderId", req.getRazorpayOrderId()));

        if (payment.getStatus() == Payment.Status.SUCCESS) {
            return; // idempotent
        }

        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        boolean valid = hmacSha256Matches(payload, req.getRazorpaySignature(),
                razorpayProperties.getKeySecret());

        if (!valid) {
            payment.setStatus(Payment.Status.FAILED);
            payment.setErrorDescription("Signature verification failed");
            paymentRepository.save(payment);
            orderService.markPaymentFailed(payment.getOrder().getId());
            throw new BadRequestException("Payment signature verification failed");
        }

        payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
        payment.setRazorpaySignature(req.getRazorpaySignature());
        payment.setStatus(Payment.Status.SUCCESS);
        paymentRepository.save(payment);

        orderService.markPaid(payment.getOrder().getId());
    }

    // ─── Webhook ──────────────────────────────────────────────────────────────

    @Transactional
    public void handleWebhook(String rawBody, String signature) {
        // Verify signature with webhook secret (different from key secret)
        if (!hmacSha256Matches(rawBody, signature, razorpayProperties.getWebhookSecret())) {
            log.warn("Razorpay webhook signature mismatch — ignoring");
            throw new BadRequestException("Invalid webhook signature");
        }

        try {
            JsonNode root  = objectMapper.readTree(rawBody);
            String   event = root.path("event").asText();
            log.info("Razorpay webhook event: {}", event);

            switch (event) {
                case "payment.captured" -> {
                    JsonNode paymentNode = root.at("/payload/payment/entity");
                    String rzpOrderId  = paymentNode.path("order_id").asText();
                    String rzpPaymentId = paymentNode.path("id").asText();
                    handlePaymentCaptured(rzpOrderId, rzpPaymentId);
                }
                case "payment.failed" -> {
                    JsonNode paymentNode = root.at("/payload/payment/entity");
                    String rzpOrderId  = paymentNode.path("order_id").asText();
                    String errorCode   = paymentNode.path("error_code").asText(null);
                    String errorDesc   = paymentNode.path("error_description").asText(null);
                    handlePaymentFailed(rzpOrderId, errorCode, errorDesc);
                }
                case "refund.created" -> {
                    JsonNode refundNode = root.at("/payload/refund/entity");
                    String rzpPaymentId = refundNode.path("payment_id").asText();
                    handleRefundCreated(rzpPaymentId);
                }
                default -> log.debug("Unhandled Razorpay event: {}", event);
            }
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
            throw new BadRequestException("Webhook processing error: " + e.getMessage());
        }
    }

    private void handlePaymentCaptured(String rzpOrderId, String rzpPaymentId) {
        paymentRepository.findByRazorpayOrderId(rzpOrderId).ifPresentOrElse(payment -> {
            if (payment.getStatus() == Payment.Status.SUCCESS) return; // idempotent
            payment.setRazorpayPaymentId(rzpPaymentId);
            payment.setStatus(Payment.Status.SUCCESS);
            paymentRepository.save(payment);
            orderService.markPaid(payment.getOrder().getId());
        }, () -> log.warn("Webhook: payment not found for razorpayOrderId={}", rzpOrderId));
    }

    private void handlePaymentFailed(String rzpOrderId, String errorCode, String errorDesc) {
        paymentRepository.findByRazorpayOrderId(rzpOrderId).ifPresent(payment -> {
            payment.setStatus(Payment.Status.FAILED);
            payment.setErrorCode(errorCode);
            payment.setErrorDescription(errorDesc);
            paymentRepository.save(payment);
            orderService.markPaymentFailed(payment.getOrder().getId());
        });
    }

    private void handleRefundCreated(String rzpPaymentId) {
        paymentRepository.findByRazorpayPaymentId(rzpPaymentId).ifPresent(payment -> {
            payment.setStatus(Payment.Status.REFUNDED);
            paymentRepository.save(payment);
            orderService.markRefunded(payment.getOrder().getId());
        });
    }

    // ─── Admin refund ─────────────────────────────────────────────────────────

    @Transactional
    public void triggerRefund(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for order", orderId));

        if (payment.getStatus() != Payment.Status.SUCCESS) {
            throw new BadRequestException("Cannot refund a payment that is not in SUCCESS state");
        }
        if (payment.getRazorpayPaymentId() == null) {
            throw new BadRequestException("No Razorpay payment ID on record — cannot refund");
        }

        try {
            RazorpayClient client = new RazorpayClient(
                    razorpayProperties.getKeyId(), razorpayProperties.getKeySecret());

            int amountInPaise = payment.getAmount().multiply(BigDecimal.valueOf(100)).intValue();
            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("speed", "normal");

            client.payments.refund(payment.getRazorpayPaymentId(), options);

            // Optimistically mark as refunded; Razorpay will also send a refund.created webhook
            payment.setStatus(Payment.Status.REFUNDED);
            paymentRepository.save(payment);
            orderService.markRefunded(orderId);

        } catch (RazorpayException e) {
            throw new BadRequestException("Refund failed: " + e.getMessage());
        }
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    private boolean hmacSha256Matches(String payload, String expected, String secret) {
        if (secret == null || secret.isBlank()) {
            log.warn("HMAC secret is blank — skipping signature verification");
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).equals(expected);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("HMAC computation error", e);
            return false;
        }
    }
}
