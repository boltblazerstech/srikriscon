-- ─── Categories ───────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
    ('Electronics',  'electronics',  'Electronic devices and accessories'),
    ('Clothing',     'clothing',     'Fashion and apparel'),
    ('Books',        'books',        'Books and educational materials'),
    ('Home & Garden','home-garden',  'Home decor and garden supplies');

-- Sub-categories
INSERT INTO categories (name, slug, description, parent_id) VALUES
    ('Audio',     'audio',     'Headphones, speakers and audio gear',
        (SELECT id FROM categories WHERE slug = 'electronics')),
    ('Computers', 'computers', 'Laptops, desktops and peripherals',
        (SELECT id FROM categories WHERE slug = 'electronics'));

-- ─── Admin user ───────────────────────────────────────────────────────────────
-- Password is "admin123" — change before going to production
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('admin@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Admin', 'User', 'ADMIN');

-- ─── Sample products ──────────────────────────────────────────────────────────
INSERT INTO products (name, slug, description, price, stock_quantity, category_id) VALUES
    ('Wireless Headphones',
     'wireless-headphones',
     'Premium noise-canceling wireless headphones with 30-hour battery life.',
     79.99, 50,
     (SELECT id FROM categories WHERE slug = 'audio')),

    ('Mechanical Keyboard',
     'mechanical-keyboard',
     'Full-size RGB mechanical keyboard with tactile switches.',
     129.99, 30,
     (SELECT id FROM categories WHERE slug = 'computers')),

    ('Classic White T-Shirt',
     'classic-white-t-shirt',
     '100% organic cotton, available in sizes XS–3XL.',
     19.99, 200,
     (SELECT id FROM categories WHERE slug = 'clothing')),

    ('Spring Boot in Action',
     'spring-boot-in-action',
     'A comprehensive guide to building production-ready Spring Boot applications.',
     39.99, 75,
     (SELECT id FROM categories WHERE slug = 'books')),

    ('Lucky Bamboo Plant',
     'lucky-bamboo-plant',
     'Indoor lucky bamboo plant in decorative ceramic pot.',
     14.99, 60,
     (SELECT id FROM categories WHERE slug = 'home-garden'));
