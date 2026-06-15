-- ─── Orders: payment status + shipment tracking columns ─────────────────────
ALTER TABLE orders
    ADD COLUMN payment_status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    ADD COLUMN awb_code               VARCHAR(100),
    ADD COLUMN shiprocket_shipment_id VARCHAR(100);

-- Rename initial status value PENDING → PLACED
UPDATE orders SET status = 'PLACED' WHERE status = 'PENDING';
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'PLACED';

-- ─── Order items: variant snapshot ────────────────────────────────────────────
ALTER TABLE order_items
    ADD COLUMN variant_id    BIGINT,
    ADD COLUMN variant_type  VARCHAR(20),
    ADD COLUMN variant_value VARCHAR(100);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_awb            ON orders(awb_code);
