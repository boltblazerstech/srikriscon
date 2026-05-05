package com.ecommerce.backend.delivery.service;

import com.ecommerce.backend.common.config.ShiprocketProperties;
import com.ecommerce.backend.common.exception.BadRequestException;
import com.ecommerce.backend.common.exception.ResourceNotFoundException;
import com.ecommerce.backend.delivery.dto.ServiceabilityResponse;
import com.ecommerce.backend.delivery.dto.ShipmentResponse;
import com.ecommerce.backend.delivery.entity.Shipment;
import com.ecommerce.backend.delivery.repository.ShipmentRepository;
import com.ecommerce.backend.order.entity.Order;
import com.ecommerce.backend.order.repository.OrderRepository;
import com.ecommerce.backend.order.service.OrderService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiprocketService {

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final ShipmentRepository  shipmentRepository;
    private final OrderRepository     orderRepository;
    private final OrderService        orderService;
    private final ShiprocketProperties props;
    private final OkHttpClient        httpClient;
    private final ObjectMapper        objectMapper;

    private String  cachedToken;
    private Instant tokenFetchedAt;

    // ─── Token management ─────────────────────────────────────────────────────

    public synchronized String getToken() {
        if (isTokenValid()) return cachedToken;
        try {
            Map<String, String> creds = new LinkedHashMap<>();
            creds.put("email", props.getEmail());
            creds.put("password", props.getPassword());

            Request req = new Request.Builder()
                    .url(props.getBaseUrl() + "/auth/login")
                    .post(RequestBody.create(objectMapper.writeValueAsString(creds), JSON))
                    .build();

            try (Response resp = httpClient.newCall(req).execute()) {
                JsonNode node = objectMapper.readTree(requireBody(resp));
                cachedToken    = node.get("token").asText();
                tokenFetchedAt = Instant.now();
                log.debug("Shiprocket token refreshed");
                return cachedToken;
            }
        } catch (IOException e) {
            throw new BadRequestException("Failed to authenticate with Shiprocket: " + e.getMessage());
        }
    }

    public synchronized void invalidateToken() {
        cachedToken    = null;
        tokenFetchedAt = null;
    }

    private boolean isTokenValid() {
        if (cachedToken == null || tokenFetchedAt == null) return false;
        long maxAgeHours = props.getTokenRefreshIntervalHours() > 0
                ? props.getTokenRefreshIntervalHours() : 9;
        return Instant.now().isBefore(tokenFetchedAt.plus(maxAgeHours, ChronoUnit.HOURS));
    }

    // ─── Serviceability check (public) ────────────────────────────────────────

    public ServiceabilityResponse checkServiceability(String deliveryPincode) {
        // Uses a fixed pickup pincode placeholder — configure via settings in production
        String url = props.getBaseUrl()
                + "/courier/serviceability/?pickup_postcode=110001"
                + "&delivery_postcode=" + deliveryPincode
                + "&weight=1&cod=0";

        try {
            Request req = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + getToken())
                    .get()
                    .build();

            try (Response resp = httpClient.newCall(req).execute()) {
                if (resp.code() == 401) { invalidateToken(); }
                String body = requireBody(resp);
                JsonNode node = objectMapper.readTree(body);

                JsonNode couriersNode = node.path("data").path("available_courier_companies");
                List<Map<String, Object>> couriers = new ArrayList<>();
                if (couriersNode.isArray()) {
                    for (JsonNode c : couriersNode) {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id",   c.path("courier_company_id").asInt());
                        m.put("name", c.path("courier_name").asText());
                        m.put("etd",  c.path("etd").asText());
                        m.put("rate", c.path("rate").asDouble());
                        couriers.add(m);
                    }
                }
                return ServiceabilityResponse.builder()
                        .pincode(deliveryPincode)
                        .available(!couriers.isEmpty())
                        .availableCouriers(couriers)
                        .build();
            }
        } catch (IOException e) {
            throw new BadRequestException("Shiprocket serviceability check failed: " + e.getMessage());
        }
    }

    // ─── Create shipment (admin) ──────────────────────────────────────────────

    @Transactional
    public ShipmentResponse createShipment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getStatus() == Order.Status.CANCELLED || order.getStatus() == Order.Status.DELIVERED) {
            throw new BadRequestException("Cannot create shipment for order in status: " + order.getStatus());
        }
        if (order.getPaymentStatus() != Order.PaymentStatus.PAID) {
            throw new BadRequestException("Cannot ship an order that has not been paid");
        }

        try {
            String payload = buildCreateOrderPayload(order);
            String body    = shiprocketPost("/orders/create/adhoc", payload);
            JsonNode node  = objectMapper.readTree(body);

            String rzShipmentId = node.path("shipment_id").asText(null);
            String awbCode      = node.path("awb_code").asText(null);
            String courierId    = node.path("courier_company_id").asText(null);
            String courierName  = node.path("courier_name").asText(null);

            Shipment shipment = Shipment.builder()
                    .order(order)
                    .shiprocketOrderId(node.path("order_id").asText(null))
                    .shiprocketShipmentId(rzShipmentId)
                    .awbCode(awbCode)
                    .courierId(courierId != null && !courierId.isBlank() ? Integer.parseInt(courierId) : null)
                    .courierName(courierName)
                    .status("CREATED")
                    .build();

            Shipment saved = shipmentRepository.save(shipment);

            // Back-write AWB + shipment ID to the order, and advance status to SHIPPED
            orderService.updateShipmentInfo(orderId, awbCode, rzShipmentId);

            return ShipmentResponse.from(saved);

        } catch (IOException e) {
            throw new BadRequestException("Shiprocket request failed: " + e.getMessage());
        }
    }

    // ─── Track by AWB (public) ────────────────────────────────────────────────

    public ShipmentResponse trackByAwb(String awbCode) {
        Shipment shipment = shipmentRepository.findByAwbCode(awbCode)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "awbCode", awbCode));

        try {
            Request req = new Request.Builder()
                    .url(props.getBaseUrl() + "/courier/track/awb/" + awbCode)
                    .addHeader("Authorization", "Bearer " + getToken())
                    .get()
                    .build();

            try (Response resp = httpClient.newCall(req).execute()) {
                if (resp.code() == 401) invalidateToken();
                JsonNode node = objectMapper.readTree(requireBody(resp));

                // Update shipment status from live tracking data
                JsonNode tracking = node.path("tracking_data").path("shipment_track").path(0);
                if (!tracking.isMissingNode()) {
                    String liveStatus = tracking.path("current_status").asText(null);
                    if (liveStatus != null) {
                        shipment.setStatus(liveStatus);
                        shipmentRepository.save(shipment);
                    }
                    String trackUrl = tracking.path("track_url").asText(null);
                    if (trackUrl != null && !trackUrl.isBlank()) {
                        shipment.setTrackingUrl(trackUrl);
                        shipmentRepository.save(shipment);
                    }
                }
            }
        } catch (IOException e) {
            log.warn("Failed to fetch live tracking for AWB {}: {}", awbCode, e.getMessage());
            // Return stored data even if live fetch fails
        }

        return ShipmentResponse.from(shipment);
    }

    /** Track by order ID — returns stored shipment details. */
    @Transactional(readOnly = true)
    public ShipmentResponse trackByOrderId(Long orderId) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment for order", orderId));
        return ShipmentResponse.from(shipment);
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    private String shiprocketPost(String path, String jsonBody) throws IOException {
        Request req = new Request.Builder()
                .url(props.getBaseUrl() + path)
                .addHeader("Authorization", "Bearer " + getToken())
                .post(RequestBody.create(jsonBody, JSON))
                .build();

        try (Response resp = httpClient.newCall(req).execute()) {
            String body = requireBody(resp);
            if (!resp.isSuccessful()) {
                if (resp.code() == 401) invalidateToken();
                throw new BadRequestException("Shiprocket error (" + resp.code() + "): " + body);
            }
            return body;
        }
    }

    private String requireBody(Response resp) throws IOException {
        ResponseBody body = resp.body();
        if (body == null) throw new IOException("Empty response body from Shiprocket");
        return body.string();
    }

    private String buildCreateOrderPayload(Order order) throws com.fasterxml.jackson.core.JsonProcessingException {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("order_id",        order.getOrderNumber());
        payload.put("order_date",      order.getCreatedAt().toLocalDate().toString());
        payload.put("pickup_location", "Primary");
        payload.put("billing_customer_name", order.getShippingName());
        payload.put("billing_phone",   order.getShippingPhone());
        payload.put("billing_address", order.getShippingLine1());
        payload.put("billing_address_2", Optional.ofNullable(order.getShippingLine2()).orElse(""));
        payload.put("billing_city",    order.getShippingCity());
        payload.put("billing_state",   order.getShippingState());
        payload.put("billing_pincode", order.getShippingPostalCode());
        payload.put("billing_country", Optional.ofNullable(order.getShippingCountry()).orElse("India"));
        payload.put("billing_email",   order.getUser().getEmail());
        payload.put("shipping_is_billing", true);
        payload.put("payment_method",  "Prepaid");
        payload.put("sub_total",       order.getTotalAmount());
        payload.put("length",  10);
        payload.put("breadth", 10);
        payload.put("height",  10);
        payload.put("weight",  0.5);
        payload.put("order_items", order.getItems().stream()
                .map(i -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("name",          i.getProductName());
                    item.put("sku",           Optional.ofNullable(i.getProductSku()).orElse("N/A"));
                    item.put("units",         i.getQuantity());
                    item.put("selling_price", i.getUnitPrice());
                    return item;
                }).toList());
        return objectMapper.writeValueAsString(payload);
    }
}
