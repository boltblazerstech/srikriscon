CREATE TABLE IF NOT EXISTS product_faqs (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_product_faqs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_faqs_product_id ON product_faqs(product_id);
