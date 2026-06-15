-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id             BIGSERIAL    PRIMARY KEY,
    email          VARCHAR(255) NOT NULL,
    password       VARCHAR(255) NOT NULL,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    phone          VARCHAR(20),
    role           VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- ─── Refresh Tokens ───────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    token      VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP    NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_refresh_token UNIQUE (token),
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    description TEXT,
    image_url   VARCHAR(512),
    parent_id   BIGINT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_category_slug UNIQUE (slug),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE products (
    id                  BIGSERIAL      PRIMARY KEY,
    name                VARCHAR(255)   NOT NULL,
    slug                VARCHAR(255)   NOT NULL,
    description         TEXT,
    short_description   VARCHAR(500),
    price               DECIMAL(10,2)  NOT NULL,
    compare_price       DECIMAL(10,2),
    cost_price          DECIMAL(10,2),
    sku                 VARCHAR(100),
    stock_quantity      INT            NOT NULL DEFAULT 0,
    low_stock_threshold INT            NOT NULL DEFAULT 5,
    weight              DECIMAL(8,3),
    category_id         BIGINT,
    is_active           BOOLEAN        NOT NULL DEFAULT TRUE,
    is_featured         BOOLEAN        NOT NULL DEFAULT FALSE,
    meta_title          VARCHAR(255),
    meta_description    VARCHAR(500),
    created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_product_slug UNIQUE (slug),
    CONSTRAINT uk_product_sku UNIQUE (sku),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─── Product Images ───────────────────────────────────────────────────────────
CREATE TABLE product_images (
    id         BIGSERIAL    PRIMARY KEY,
    product_id BIGINT       NOT NULL,
    url        VARCHAR(512) NOT NULL,
    alt_text   VARCHAR(255),
    sort_order INT          NOT NULL DEFAULT 0,
    is_primary BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_image FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─── Addresses ────────────────────────────────────────────────────────────────
CREATE TABLE addresses (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    line1       VARCHAR(255) NOT NULL,
    line2       VARCHAR(255),
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20)  NOT NULL,
    country     VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default  BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE orders (
    id                   BIGSERIAL      PRIMARY KEY,
    order_number         VARCHAR(50)    NOT NULL,
    user_id              BIGINT         NOT NULL,
    status               VARCHAR(50)    NOT NULL DEFAULT 'PENDING',
    subtotal             DECIMAL(10,2)  NOT NULL,
    discount_amount      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    shipping_amount      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    tax_amount           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    total_amount         DECIMAL(10,2)  NOT NULL,
    currency             VARCHAR(3)     NOT NULL DEFAULT 'INR',
    shipping_name        VARCHAR(100),
    shipping_phone       VARCHAR(20),
    shipping_line1       VARCHAR(255),
    shipping_line2       VARCHAR(255),
    shipping_city        VARCHAR(100),
    shipping_state       VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country     VARCHAR(100),
    notes                TEXT,
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_order_number UNIQUE (order_number),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ─── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    id           BIGSERIAL     PRIMARY KEY,
    order_id     BIGINT        NOT NULL,
    product_id   BIGINT        NOT NULL,
    product_name VARCHAR(255)  NOT NULL,
    product_sku  VARCHAR(100),
    quantity     INT           NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL,
    total_price  DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ─── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE payments (
    id                   BIGSERIAL     PRIMARY KEY,
    order_id             BIGINT        NOT NULL,
    razorpay_order_id    VARCHAR(100),
    razorpay_payment_id  VARCHAR(100),
    razorpay_signature   VARCHAR(512),
    amount               DECIMAL(10,2) NOT NULL,
    currency             VARCHAR(3)    NOT NULL DEFAULT 'INR',
    status               VARCHAR(50)   NOT NULL DEFAULT 'CREATED',
    method               VARCHAR(50),
    error_code           VARCHAR(100),
    error_description    TEXT,
    created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ─── Shipments ────────────────────────────────────────────────────────────────
CREATE TABLE shipments (
    id                     BIGSERIAL    PRIMARY KEY,
    order_id               BIGINT       NOT NULL,
    shiprocket_order_id    VARCHAR(100),
    shiprocket_shipment_id VARCHAR(100),
    awb_code               VARCHAR(100),
    courier_name           VARCHAR(100),
    courier_id             INT,
    status                 VARCHAR(100),
    tracking_url           VARCHAR(512),
    estimated_delivery     TIMESTAMP,
    shipped_at             TIMESTAMP,
    delivered_at           TIMESTAMP,
    created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shipment_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ─── Gallery ──────────────────────────────────────────────────────────────────
CREATE TABLE gallery_images (
    id         BIGSERIAL    PRIMARY KEY,
    url        VARCHAR(512) NOT NULL,
    public_id  VARCHAR(255),
    alt_text   VARCHAR(255),
    title      VARCHAR(255),
    file_name  VARCHAR(255),
    file_size  BIGINT,
    mime_type  VARCHAR(100),
    width      INT,
    height     INT,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── CMS Pages ────────────────────────────────────────────────────────────────
CREATE TABLE cms_pages (
    id               BIGSERIAL    PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL,
    content          TEXT,
    excerpt          TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    meta_title       VARCHAR(255),
    meta_description VARCHAR(500),
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_cms_slug UNIQUE (slug)
);

-- ─── Settings ─────────────────────────────────────────────────────────────────
CREATE TABLE settings (
    id            BIGSERIAL    PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_group VARCHAR(100) NOT NULL DEFAULT 'general',
    description   VARCHAR(255),
    is_public     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_setting_key UNIQUE (setting_key)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(is_active);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_payments_order    ON payments(order_id);
CREATE INDEX idx_shipments_order   ON shipments(order_id);
CREATE INDEX idx_addresses_user    ON addresses(user_id);
CREATE INDEX idx_settings_group    ON settings(setting_group);
