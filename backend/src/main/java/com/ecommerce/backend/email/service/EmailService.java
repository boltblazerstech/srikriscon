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
    public void sendPasswordReset(String to, String resetLink, int expiryMins, String userType) {
        boolean isAdmin = "ADMIN".equalsIgnoreCase(userType);
        String subject = isAdmin ? "[Sri Kriscon] Admin Portal Password Reset" : "[Sri Kriscon] Customer Account Password Reset";
        String accountType = isAdmin ? "Administrator (Admin Portal)" : "Customer (Storefront)";
        String buttonColor = isAdmin ? "#E6007E" : "#0B3A42";

        String body = """
            <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; font-size: 24px; font-weight: bold; color: #0B3A42; letter-spacing: 1px;">
                        Sri Kriscon
                    </div>
                </div>
                <div style="border-top: 3px solid %s; padding-top: 24px;">
                    <h2 style="color: #333333; font-size: 20px; margin-top: 0; font-weight: 600; text-align: center;">%s Password Reset</h2>
                    <p style="color: #666666; font-size: 15px; line-height: 1.6; margin-top: 20px;">
                        Hello,
                    </p>
                    <p style="color: #666666; font-size: 15px; line-height: 1.6;">
                        We received a request to reset the password for the <strong>%s</strong> account associated with this email address.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="%s" style="display: inline-block; background-color: %s; color: #ffffff; text-decoration: none; padding: 12px 32px; font-weight: bold; border-radius: 30px; font-size: 15px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; background-color: #f5f7f7; padding: 12px; border-radius: 8px;">
                        <strong>Important Security Note:</strong> This reset link is valid for <strong>%d minutes</strong>. If you did not make this request, you can safely ignore this email — your account remains secure.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 24px 0;" />
                    <p style="color: #999999; font-size: 12px; text-align: center; margin-bottom: 0;">
                        This is an automated email from Sri Kriscon. Please do not reply directly to this message.
                    </p>
                </div>
            </div>
            """.formatted(
                buttonColor,
                isAdmin ? "Admin Portal" : "Customer Account",
                accountType,
                resetLink,
                buttonColor,
                expiryMins
            );

        sendHtml(to, subject, body);
    }
}
