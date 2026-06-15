-- ─── Admin user (password: admin123) ─────────────────────────────────────────
INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified) VALUES
    ('admin@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Admin', 'User', 'ADMIN', TRUE, TRUE);

-- ─── Categories ───────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Electronics',   'electronics',  'Electronic devices and accessories', 1),
    ('Clothing',      'clothing',     'Fashion and apparel',                2),
    ('Books',         'books',        'Books and educational materials',    3),
    ('Home & Garden', 'home-garden',  'Home decor and garden supplies',     4);

INSERT INTO categories (name, slug, description, parent_id, sort_order)
    SELECT 'Audio', 'audio', 'Headphones, speakers and audio gear', id, 1
    FROM categories WHERE slug = 'electronics';

INSERT INTO categories (name, slug, description, parent_id, sort_order)
    SELECT 'Computers', 'computers', 'Laptops, desktops and peripherals', id, 2
    FROM categories WHERE slug = 'electronics';

-- ─── Sample products ──────────────────────────────────────────────────────────
INSERT INTO products (name, slug, description, short_description, price, stock_quantity, sku, category_id, is_featured)
    SELECT
        'Wireless Headphones',
        'wireless-headphones',
        'Premium noise-canceling wireless headphones with 30-hour battery life and foldable design.',
        'Premium noise-canceling headphones, 30-hour battery.',
        79.99, 50, 'AUDIO-001',
        id, TRUE
    FROM categories WHERE slug = 'audio';

INSERT INTO products (name, slug, description, short_description, price, stock_quantity, sku, category_id)
    SELECT
        'Mechanical Keyboard',
        'mechanical-keyboard',
        'Full-size RGB mechanical keyboard with tactile switches and per-key lighting.',
        'RGB mechanical gaming keyboard.',
        129.99, 30, 'COMP-001',
        id
    FROM categories WHERE slug = 'computers';

INSERT INTO products (name, slug, description, short_description, price, stock_quantity, sku, category_id)
    SELECT
        'Classic White T-Shirt',
        'classic-white-t-shirt',
        '100% organic cotton, pre-shrunk, available in sizes XS–3XL.',
        '100% organic cotton t-shirt.',
        19.99, 200, 'CLO-001',
        id
    FROM categories WHERE slug = 'clothing';

INSERT INTO products (name, slug, description, short_description, price, stock_quantity, sku, category_id)
    SELECT
        'Spring Boot in Action',
        'spring-boot-in-action',
        'A comprehensive guide to building production-ready Spring Boot 3 applications.',
        'Learn Spring Boot from scratch.',
        39.99, 75, 'BOOK-001',
        id
    FROM categories WHERE slug = 'books';

-- ─── Default settings ─────────────────────────────────────────────────────────
INSERT INTO settings (setting_key, setting_value, setting_group, description, is_public) VALUES
    ('store_name',               'My Store',           'general',  'Store display name',               TRUE),
    ('store_email',              'store@example.com',  'general',  'Store contact email',              TRUE),
    ('store_phone',              '',                   'general',  'Store contact phone',              TRUE),
    ('store_currency',           'INR',                'general',  'Default currency code',            TRUE),
    ('store_timezone',           'Asia/Kolkata',       'general',  'Store timezone',                   FALSE),
    ('store_logo_url',           '',                   'general',  'URL of the store logo',            TRUE),
    ('free_shipping_threshold',  '500',                'shipping', 'Min order amount for free shipping', TRUE),
    ('default_shipping_cost',    '50',                 'shipping', 'Default flat shipping rate',       TRUE),
    ('tax_rate_percent',         '0',                  'tax',      'Default tax rate percentage',      FALSE),
    ('order_prefix',             'ORD',                'orders',   'Prefix for order numbers',         FALSE),
    ('low_stock_notification',   'true',               'inventory','Send email on low stock',          FALSE),
    ('maintenance_mode',         'false',              'general',  'Put the store in maintenance mode', FALSE);
