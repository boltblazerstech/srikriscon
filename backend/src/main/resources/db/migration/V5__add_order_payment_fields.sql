-- ─── Orders: payment status + shipment tracking columns ─────────────────────
ALTER TABLE orders
    ADD COLUMN payment_status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING' AFTER status,
    ADD COLUMN awb_code               VARCHAR(100)           AFTER notes,
    ADD COLUMN shiprocket_shipment_id VARCHAR(100)           AFTER awb_code;

-- Rename initial status value PENDING → PLACED
UPDATE orders SET status = 'PLACED' WHERE status = 'PENDING';
ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PLACED';

-- ─── Order items: variant snapshot ────────────────────────────────────────────
ALTER TABLE order_items
    ADD COLUMN variant_id    BIGINT      AFTER product_id,
    ADD COLUMN variant_type  VARCHAR(20) AFTER product_sku,
    ADD COLUMN variant_value VARCHAR(100) AFTER variant_type;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_awb            ON orders(awb_code);
