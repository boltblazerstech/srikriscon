-- ─── Product Variants ────────────────────────────────────────────────────────
CREATE TABLE product_variants (
    id             BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id     BIGINT        NOT NULL,
    type           VARCHAR(20)   NOT NULL,  -- SIZE | DESIGN | MATERIAL
    value          VARCHAR(100)  NOT NULL,
    price          DECIMAL(10,2) NOT NULL,
    stock_quantity INT           NOT NULL DEFAULT 0,
    is_active      TINYINT(1)    NOT NULL DEFAULT 1,
    sort_order     INT           NOT NULL DEFAULT 0,
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Add missing columns to products ─────────────────────────────────────────
ALTER TABLE products
    ADD COLUMN min_order_qty INT      NOT NULL DEFAULT 1 AFTER low_stock_threshold,
    ADD COLUMN sort_order    INT      NOT NULL DEFAULT 0 AFTER is_featured,
    ADD COLUMN deleted_at    DATETIME             AFTER updated_at;

-- Remove unique constraint on slug to support soft-deleted records sharing names;
-- application layer enforces uniqueness among non-deleted rows.
ALTER TABLE products DROP KEY uk_product_slug;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_deleted  ON products(deleted_at);
CREATE INDEX idx_products_sort     ON products(sort_order);
CREATE INDEX idx_variants_product  ON product_variants(product_id);
CREATE INDEX idx_variants_type     ON product_variants(product_id, type);
