-- ─── Admin user (password: admin123) ─────────────────────────────────────────
INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified) VALUES
    ('admin@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Admin', 'User', 'ADMIN', 1, 1);

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
        id, 1
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
    ('store_name',               'Sri Kriscon',        'general',  'Store display name',               1),
    ('store_email',              'info@srikriscon.com','general',  'Store contact email',              1),
    ('store_phone',              '7999921111',         'general',  'Store contact phone',              1),
    ('store_currency',           'INR',                'general',  'Default currency code',            1),
    ('store_timezone',           'Asia/Kolkata',       'general',  'Store timezone',                   0),
    ('store_logo_url',           '',                   'general',  'URL of the store logo',            1),
    ('free_shipping_threshold',  '500',                'shipping', 'Min order amount for free shipping', 1),
    ('default_shipping_cost',    '50',                 'shipping', 'Default flat shipping rate',       1),
    ('tax_rate_percent',         '0',                  'tax',      'Default tax rate percentage',      0),
    ('order_prefix',             'ORD',                'orders',   'Prefix for order numbers',         0),
    ('low_stock_notification',   'true',               'inventory','Send email on low stock',          0),
    ('maintenance_mode',         'false',              'general',  'Put the store in maintenance mode', 0);
