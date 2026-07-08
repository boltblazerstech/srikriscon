package com.ecommerce.backend.email.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${email.from}")
    private String from;

    @Value("${email.from-name}")
    private String fromName;

    // ─── Generic sender ───────────────────────────────────────────────────────

    @Async
    public void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(msg);
            log.debug("Email sent to {} | subject: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    // ─── Order emails ─────────────────────────────────────────────────────────

    @Async
    public void sendOrderPlaced(String to, String customerName, String orderNumber, String totalAmount) {
        String subject = "Order Received — " + orderNumber;
        String body = """
                <p>Hi %s,</p>
                <p>We have received your order <strong>%s</strong>.</p>
                <p><strong>Total: %s</strong></p>
                <p>You will receive another email once your payment is confirmed.</p>
                <p>Thank you for shopping with us!</p>
                """.formatted(customerName, orderNumber, totalAmount);
        sendHtml(to, subject, body);
    }

    @Async
    public void sendPaymentConfirmed(String to, String customerName, String orderNumber, String totalAmount) {
        String subject = "Payment Confirmed — " + orderNumber;
        String body = """
                <p>Hi %s,</p>
                <p>Your payment for order <strong>%s</strong> has been confirmed.</p>
                <p><strong>Total Paid: %s</strong></p>
                <p>We are now processing your order.</p>
                <p>Thank you for shopping with us!</p>
                """.formatted(customerName, orderNumber, totalAmount);
        sendHtml(to, subject, body);
    }

    @Async
    public void sendOrderStatusChanged(String to, String customerName, String orderNumber, String newStatus) {
        String subject = "Order Update — " + orderNumber;
        String body = """
                <p>Hi %s,</p>
                <p>Your order <strong>%s</strong> status has been updated to: <strong>%s</strong>.</p>
                <p>Thank you for your patience!</p>
                """.formatted(customerName, orderNumber, newStatus);
        sendHtml(to, subject, body);
    }

    @Async
    public void sendOrderShipped(String to, String customerName, String orderNumber, String trackingUrl) {
        String subject = "Your Order " + orderNumber + " Has Been Shipped!";
        String body = """
                <p>Hi %s,</p>
                <p>Your order <strong>%s</strong> is on its way.</p>
                %s
                <p>Thank you for your patience!</p>
                """.formatted(customerName, orderNumber,
                trackingUrl != null ? "<p><a href=\"" + trackingUrl + "\">Track Your Shipment</a></p>" : "");
        sendHtml(to, subject, body);
    }

    @Async
    public void sendOrderCancelled(String to, String customerName, String orderNumber) {
        String subject = "Order Cancelled — " + orderNumber;
        String body = """
                <p>Hi %s,</p>
                <p>Your order <strong>%s</strong> has been cancelled.</p>
                <p>If you paid for this order, a refund will be processed shortly.</p>
                <p>Please contact support if you have any questions.</p>
                """.formatted(customerName, orderNumber);
        sendHtml(to, subject, body);
    }

    // ─── Auth emails ──────────────────────────────────────────────────────────

    @Async
    public void sendPasswordReset(String to, String resetLink, int expiryMins) {
        String subject = "Reset Your Password";
        String body = """
                <p>Click the link below to reset your password. This link is valid for %d minutes.</p>
                <p><a href="%s">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
                """.formatted(expiryMins, resetLink);
        sendHtml(to, subject, body);
    }
}
