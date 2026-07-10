-- ─── V8: Comprehensive dummy data ────────────────────────────────────────────

-- ─── Customers ────────────────────────────────────────────────────────────────
INSERT INTO users (email, password, first_name, last_name, phone, role, is_active, email_verified) VALUES
  ('rahul.sharma@gmail.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rahul',  'Sharma', '9876543210', 'CUSTOMER', 1, 1),
  ('priya.patel@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya',  'Patel',  '9123456789', 'CUSTOMER', 1, 1),
  ('amit.kumar@outlook.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Amit',   'Kumar',  '8765432109', 'CUSTOMER', 1, 1),
  ('sneha.singh@yahoo.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sneha',  'Singh',  '7654321098', 'CUSTOMER', 1, 1),
  ('vikram.nair@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vikram', 'Nair',   '9988776655', 'CUSTOMER', 1, 1);

-- ─── Extra Admin Users ────────────────────────────────────────────────────────
INSERT INTO admin_users (email, password, first_name, last_name, role, is_active) VALUES
  ('manager@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ananya', 'Verma', 'ADMIN', 1),
  ('inventory@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rohit',  'Mehta', 'ADMIN', 1);

-- ─── Addresses ────────────────────────────────────────────────────────────────
INSERT INTO addresses (user_id, name, phone, line1, line2, city, state, postal_code, country, is_default)
  SELECT id, 'Rahul Sharma', '9876543210', '42 MG Road', 'Koramangala', 'Bengaluru', 'Karnataka', '560034', 'India', 1
  FROM users WHERE email = 'rahul.sharma@gmail.com';

INSERT INTO addresses (user_id, name, phone, line1, city, state, postal_code, country, is_default)
  SELECT id, 'Priya Patel', '9123456789', '15 Navrangpura', 'Ahmedabad', 'Gujarat', '380009', 'India', 1
  FROM users WHERE email = 'priya.patel@gmail.com';

INSERT INTO addresses (user_id, name, phone, line1, line2, city, state, postal_code, country, is_default)
  SELECT id, 'Amit Kumar', '8765432109', '7/B Lajpat Nagar', 'Block C', 'New Delhi', 'Delhi', '110024', 'India', 1
  FROM users WHERE email = 'amit.kumar@outlook.com';

INSERT INTO addresses (user_id, name, phone, line1, city, state, postal_code, country, is_default)
  SELECT id, 'Sneha Singh', '7654321098', '22 Anna Salai', 'Chennai', 'Tamil Nadu', '600002', 'India', 1
  FROM users WHERE email = 'sneha.singh@yahoo.com';

INSERT INTO addresses (user_id, name, phone, line1, city, state, postal_code, country, is_default)
  SELECT id, 'Vikram Nair', '9988776655', '8 Marine Drive', 'Mumbai', 'Maharashtra', '400020', 'India', 1
  FROM users WHERE email = 'vikram.nair@gmail.com';

-- ─── Additional Categories ────────────────────────────────────────────────────
-- INSERT...SELECT form avoids MySQL's self-referencing subquery restriction.
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  SELECT 'Mobile Phones', 'mobile-phones', 'Smartphones and mobile accessories', id, 3, 1
  FROM categories WHERE slug = 'electronics';

INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  SELECT 'Cameras', 'cameras', 'Digital cameras and photography gear', id, 4, 1
  FROM categories WHERE slug = 'electronics';

INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  SELECT 'Tech & Programming', 'tech-programming', 'Technology and programming books', id, 1, 1
  FROM categories WHERE slug = 'books';

INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  SELECT 'Self Help', 'self-help', 'Personal development and motivation books', id, 2, 1
  FROM categories WHERE slug = 'books';

INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  SELECT 'Kitchen & Dining', 'kitchen-dining', 'Cookware, utensils and dining accessories', id, 1, 1
  FROM categories WHERE slug = 'home-garden';

INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
  ('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness accessories', 5, 1),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Skincare, haircare and personal hygiene', 6, 1);

-- ─── Update existing products ─────────────────────────────────────────────────
UPDATE products SET compare_price = 9999.00, price = 6999.00, is_featured = 1, sort_order = 1 WHERE slug = 'wireless-headphones';
UPDATE products SET compare_price = 13999.00, price = 10999.00, is_featured = 1, sort_order = 2 WHERE slug = 'mechanical-keyboard';
UPDATE products SET compare_price = 1299.00, price = 799.00, sort_order = 1 WHERE slug = 'classic-white-t-shirt';
UPDATE products SET price = 649.00, is_featured = 1, sort_order = 1 WHERE slug = 'spring-boot-in-action';

-- ─── New Products ─────────────────────────────────────────────────────────────

-- Audio
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Bluetooth Portable Speaker', 'bluetooth-portable-speaker',
    'Waterproof IPX7 Bluetooth 5.0 portable speaker with 360° surround sound, 12-hour battery, and built-in mic for hands-free calling. Perfect for outdoor use.',
    'IPX7 waterproof, 360° sound, 12h battery.', 1499.00, 1999.00, 'AUDIO-002', 80, id, 1, 1, 2, 1
  FROM categories WHERE slug = 'audio';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'True Wireless Earbuds Pro', 'true-wireless-earbuds-pro',
    'Active noise-canceling true wireless earbuds with 8mm drivers, 6-hour playtime plus 24 hours from the charging case, IPX4 sweat resistance, and touch controls.',
    'ANC earbuds, 30h total battery, IPX4.',
    2299.00, 2999.00, 'AUDIO-003', 60, id, 1, 1, 3, 1
  FROM categories WHERE slug = 'audio';

-- Computers
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Ergonomic Wireless Mouse', 'ergonomic-wireless-mouse',
    'Vertical ergonomic wireless mouse reduces wrist strain by 57%. Adjustable DPI (800/1200/1600/2400), 2.4GHz USB receiver, 18-month battery on a single AA.',
    'Vertical ergonomic design, 18-month battery.',
    899.00, 1299.00, 'COMP-002', 45, id, 1, 0, 3, 1
  FROM categories WHERE slug = 'computers';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT '7-in-1 USB-C Hub', 'usbc-hub-7in1',
    'Compact USB-C hub: 4K HDMI, 3× USB 3.0, SD + microSD card readers, and 100W Power Delivery pass-through. Plug-and-play, no drivers needed.',
    '4K HDMI, USB 3.0, 100W PD, SD card.',
    1299.00, 1799.00, 'COMP-003', 35, id, 1, 1, 4, 1
  FROM categories WHERE slug = 'computers';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT '27-inch 4K IPS Monitor', '27inch-4k-monitor',
    '27" 4K UHD IPS display with 99% sRGB, 60Hz, HDMI 2.0 and DisplayPort 1.4. Height/tilt/swivel adjustable stand, built-in speakers, VESA compatible.',
    '27" 4K IPS, 99% sRGB, adjustable stand.',
    21999.00, 27999.00, 'COMP-004', 15, id, 1, 1, 5, 1
  FROM categories WHERE slug = 'computers';

-- Mobile
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT '65W GaN Fast Charger', '65w-gan-fast-charger',
    'Compact GaN USB-C charger (65W). Charges MacBook, iPhone, Samsung Galaxy and most laptops. 2× USB-C + 1× USB-A, foldable plug.',
    'GaN 65W, 3-port, charges laptops.',
    1899.00, 2499.00, 'MOBILE-001', 100, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'mobile-phones';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Premium Tempered Glass Screen Protector', 'premium-screen-protector',
    '9H hardness tempered glass screen protector, oleophobic coating, easy-align installation frame. Pack of 2. Universal fit (specify model at checkout).',
    '9H glass, pack of 2, easy install.',
    299.00, 499.00, 'MOBILE-002', 200, id, 1, 0, 2, 1
  FROM categories WHERE slug = 'mobile-phones';

-- Clothing
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Slim Fit Stretch Jeans', 'slim-fit-stretch-jeans',
    'Premium 98% cotton + 2% elastane slim-fit jeans. Mid-rise, 5-pocket design, reinforced belt loops, zip fly. Pre-washed for softness.',
    'Stretch denim, slim fit, mid-rise.',
    1499.00, 1999.00, 'CLO-002', 120, id, 1, 1, 2, 1
  FROM categories WHERE slug = 'clothing';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Premium Hooded Sweatshirt', 'premium-hooded-sweatshirt',
    '380 GSM French terry cotton hoodie. Fleece-lined interior, kangaroo pocket, ribbed cuffs and hem, adjustable drawstring. Pre-shrunk. Unisex fit.',
    '380 GSM fleece hoodie, pre-shrunk, unisex.',
    1799.00, 2299.00, 'CLO-003', 85, id, 1, 1, 3, 1
  FROM categories WHERE slug = 'clothing';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Classic Pique Polo Shirt', 'classic-polo-shirt',
    '100% pique cotton polo with ribbed collar and cuffs, 3-button placket, and side vents. Pre-shrunk, easy care. Available in 6 colours.',
    'Pique cotton, 3-button placket, 6 colours.',
    799.00, 999.00, 'CLO-004', 150, id, 1, 0, 4, 1
  FROM categories WHERE slug = 'clothing';

-- Books
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Clean Code', 'clean-code',
    'Robert C. Martin''s essential guide to writing readable, maintainable code. Covers naming conventions, functions, error handling, unit testing, and refactoring with real Java examples.',
    'Write cleaner, more maintainable code.',
    649.00, 799.00, 'BOOK-002', 40, id, 1, 1, 2, 1
  FROM categories WHERE slug = 'books';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Atomic Habits', 'atomic-habits',
    'James Clear reveals how tiny 1% improvements compound into remarkable results. A practical framework for building good habits, breaking bad ones, and mastering your daily actions.',
    'Build habits with tiny 1% daily improvements.',
    449.00, 599.00, 'BOOK-003', 90, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'books';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Deep Work', 'deep-work',
    'Cal Newport argues that the ability to focus without distraction is the most valuable skill of our era. Learn to master deep focus and produce results that matter.',
    'Master focused, distraction-free deep work.',
    399.00, 499.00, 'BOOK-004', 55, id, 1, 0, 2, 1
  FROM categories WHERE slug = 'books';

-- Kitchen
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT '1L Insulated Stainless Steel Bottle', 'insulated-water-bottle-1l',
    'Double-wall vacuum insulated 18/8 food-grade stainless steel. Keeps drinks cold 24h, hot 12h. BPA-free, leak-proof lid, fits standard cup holders.',
    'Cold 24h, hot 12h, BPA-free.',
    799.00, 1099.00, 'HOME-001', 130, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'kitchen-dining';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Ceramic Coffee Mug Set (4 Pcs)', 'ceramic-mug-set-4',
    'Set of 4 hand-glazed stoneware mugs, 350ml each. Dishwasher and microwave safe. Earthy minimalist tones. Gift-box packaging.',
    '4× 350ml stoneware mugs, gift-box ready.',
    899.00, 1199.00, 'HOME-002', 70, id, 1, 0, 2, 1
  FROM categories WHERE slug = 'kitchen-dining';

-- Home
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'LED Architect Desk Lamp', 'led-desk-lamp',
    'Flexible gooseneck LED desk lamp. 5 colour temperatures × 10 brightness levels, 1h auto-off timer, USB-A charging port, touch panel, eye-care flicker-free light.',
    '5 colour temps, 10 brightness, USB charging.',
    1599.00, 1999.00, 'HOME-003', 45, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'home-garden';

-- Sports
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Professional Yoga Mat 6mm', 'yoga-mat-6mm',
    'Non-slip 6mm TPE yoga mat with laser-printed alignment lines, moisture-resistant surface, and included carrying strap. 183 × 61 cm. Available in 5 colours.',
    'Non-slip TPE, alignment lines, 183×61cm.',
    1199.00, 1599.00, 'SPORT-001', 90, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'sports-fitness';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Resistance Bands Set (5 Levels)', 'resistance-bands-set',
    'Set of 5 natural latex resistance bands (X-Light to X-Heavy, 5–40 lbs). Includes mesh carry bag, door anchor, ankle straps, and illustrated exercise guide.',
    '5 levels, 5-40 lbs, door anchor included.',
    799.00, 1099.00, 'SPORT-002', 110, id, 1, 1, 2, 1
  FROM categories WHERE slug = 'sports-fitness';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Adjustable Dumbbell Set 2.5–10kg', 'adjustable-dumbbell-set',
    'Pair of adjustable chrome-plated dumbbells. Quick-change weight plates from 2.5 to 10kg per dumbbell. Anti-slip knurled handle. Includes storage tray.',
    '2.5–10kg, anti-slip grip, storage tray.',
    3499.00, 4499.00, 'SPORT-003', 25, id, 1, 0, 3, 1
  FROM categories WHERE slug = 'sports-fitness';

-- Beauty
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Vitamin C Face Serum 30ml', 'vitamin-c-face-serum',
    '15% Vitamin C + Hyaluronic Acid + Vitamin E serum. Fades dark spots, boosts collagen, provides 48h hydration. Dermatologist tested, suitable for all skin types.',
    '15% Vit C + HA + Vit E, dermatologist tested.',
    899.00, 1299.00, 'BEAUTY-001', 80, id, 1, 1, 1, 1
  FROM categories WHERE slug = 'beauty-personal-care';

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured, sort_order, min_order_qty)
  SELECT 'Daily Moisturizer SPF 30 (50ml)', 'daily-moisturizer-spf30',
    'Lightweight non-greasy daily moisturizer with broad-spectrum SPF 30. Infused with Niacinamide, Aloe Vera, and Green Tea extract. 50ml. All skin types.',
    'SPF 30, Niacinamide + Aloe, 50ml.',
    699.00, 999.00, 'BEAUTY-002', 95, id, 1, 0, 2, 1
  FROM categories WHERE slug = 'beauty-personal-care';

-- ─── Product Images ───────────────────────────────────────────────────────────
-- Existing products
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/headphones1/600/600', 'Wireless Headphones front', 0, 1 FROM products WHERE slug = 'wireless-headphones';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/headphones2/600/600', 'Wireless Headphones side', 1, 0 FROM products WHERE slug = 'wireless-headphones';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/keyboard1/600/600', 'Mechanical Keyboard top', 0, 1 FROM products WHERE slug = 'mechanical-keyboard';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/keyboard2/600/600', 'Mechanical Keyboard angle', 1, 0 FROM products WHERE slug = 'mechanical-keyboard';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/tshirt1/600/600', 'Classic White T-Shirt front', 0, 1 FROM products WHERE slug = 'classic-white-t-shirt';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/springbook1/600/600', 'Spring Boot in Action cover', 0, 1 FROM products WHERE slug = 'spring-boot-in-action';

-- New products
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/btspeaker1/600/600', 'Bluetooth Speaker front', 0, 1 FROM products WHERE slug = 'bluetooth-portable-speaker';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/btspeaker2/600/600', 'Bluetooth Speaker top', 1, 0 FROM products WHERE slug = 'bluetooth-portable-speaker';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/earbuds1/600/600', 'Earbuds Pro in case', 0, 1 FROM products WHERE slug = 'true-wireless-earbuds-pro';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/earbuds2/600/600', 'Earbuds Pro worn', 1, 0 FROM products WHERE slug = 'true-wireless-earbuds-pro';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/mouse1/600/600', 'Ergonomic Mouse side', 0, 1 FROM products WHERE slug = 'ergonomic-wireless-mouse';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/usbchub1/600/600', 'USB-C Hub ports', 0, 1 FROM products WHERE slug = 'usbc-hub-7in1';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/monitor4k1/600/600', '4K Monitor front', 0, 1 FROM products WHERE slug = '27inch-4k-monitor';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/monitor4k2/600/600', '4K Monitor angle', 1, 0 FROM products WHERE slug = '27inch-4k-monitor';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/gancharger1/600/600', 'GaN Charger', 0, 1 FROM products WHERE slug = '65w-gan-fast-charger';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/screenprotect1/600/600', 'Screen Protector', 0, 1 FROM products WHERE slug = 'premium-screen-protector';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/jeans1/600/600', 'Slim Fit Jeans front', 0, 1 FROM products WHERE slug = 'slim-fit-stretch-jeans';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/jeans2/600/600', 'Slim Fit Jeans detail', 1, 0 FROM products WHERE slug = 'slim-fit-stretch-jeans';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/hoodie1/600/600', 'Hooded Sweatshirt front', 0, 1 FROM products WHERE slug = 'premium-hooded-sweatshirt';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/hoodie2/600/600', 'Hooded Sweatshirt back', 1, 0 FROM products WHERE slug = 'premium-hooded-sweatshirt';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/polo1/600/600', 'Polo Shirt front', 0, 1 FROM products WHERE slug = 'classic-polo-shirt';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/cleancode1/600/600', 'Clean Code book cover', 0, 1 FROM products WHERE slug = 'clean-code';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/atomichabits1/600/600', 'Atomic Habits book cover', 0, 1 FROM products WHERE slug = 'atomic-habits';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/deepwork1/600/600', 'Deep Work book cover', 0, 1 FROM products WHERE slug = 'deep-work';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/bottle1/600/600', 'Insulated Bottle', 0, 1 FROM products WHERE slug = 'insulated-water-bottle-1l';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/bottle2/600/600', 'Insulated Bottle open lid', 1, 0 FROM products WHERE slug = 'insulated-water-bottle-1l';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/mugs1/600/600', 'Ceramic Mug Set', 0, 1 FROM products WHERE slug = 'ceramic-mug-set-4';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/desklamp1/600/600', 'LED Desk Lamp', 0, 1 FROM products WHERE slug = 'led-desk-lamp';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/yogamat1/600/600', 'Yoga Mat rolled', 0, 1 FROM products WHERE slug = 'yoga-mat-6mm';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/yogamat2/600/600', 'Yoga Mat flat', 1, 0 FROM products WHERE slug = 'yoga-mat-6mm';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/resistbands1/600/600', 'Resistance Bands set', 0, 1 FROM products WHERE slug = 'resistance-bands-set';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/dumbbells1/600/600', 'Adjustable Dumbbells', 0, 1 FROM products WHERE slug = 'adjustable-dumbbell-set';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/vitcserum1/600/600', 'Vitamin C Serum bottle', 0, 1 FROM products WHERE slug = 'vitamin-c-face-serum';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
  SELECT id, 'https://picsum.photos/seed/moisturizer1/600/600', 'Daily Moisturizer jar', 0, 1 FROM products WHERE slug = 'daily-moisturizer-spf30';

-- ─── Product Variants ─────────────────────────────────────────────────────────
-- Classic White T-Shirt — SIZE
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'SIZE', 'XS', 799.00, 20, 1, 1 FROM products WHERE slug = 'classic-white-t-shirt'
  UNION ALL SELECT id, 'SIZE', 'S',  799.00, 40, 1, 2 FROM products WHERE slug = 'classic-white-t-shirt'
  UNION ALL SELECT id, 'SIZE', 'M',  799.00, 50, 1, 3 FROM products WHERE slug = 'classic-white-t-shirt'
  UNION ALL SELECT id, 'SIZE', 'L',  799.00, 45, 1, 4 FROM products WHERE slug = 'classic-white-t-shirt'
  UNION ALL SELECT id, 'SIZE', 'XL', 799.00, 30, 1, 5 FROM products WHERE slug = 'classic-white-t-shirt'
  UNION ALL SELECT id, 'SIZE', 'XXL',849.00, 15, 1, 6 FROM products WHERE slug = 'classic-white-t-shirt';

-- Slim Fit Jeans — SIZE
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'SIZE', '28', 1499.00, 20, 1, 1 FROM products WHERE slug = 'slim-fit-stretch-jeans'
  UNION ALL SELECT id, 'SIZE', '30', 1499.00, 30, 1, 2 FROM products WHERE slug = 'slim-fit-stretch-jeans'
  UNION ALL SELECT id, 'SIZE', '32', 1499.00, 35, 1, 3 FROM products WHERE slug = 'slim-fit-stretch-jeans'
  UNION ALL SELECT id, 'SIZE', '34', 1499.00, 25, 1, 4 FROM products WHERE slug = 'slim-fit-stretch-jeans'
  UNION ALL SELECT id, 'SIZE', '36', 1549.00, 10, 1, 5 FROM products WHERE slug = 'slim-fit-stretch-jeans';

-- Hooded Sweatshirt — SIZE
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'SIZE', 'S',   1799.00, 15, 1, 1 FROM products WHERE slug = 'premium-hooded-sweatshirt'
  UNION ALL SELECT id, 'SIZE', 'M',   1799.00, 25, 1, 2 FROM products WHERE slug = 'premium-hooded-sweatshirt'
  UNION ALL SELECT id, 'SIZE', 'L',   1799.00, 25, 1, 3 FROM products WHERE slug = 'premium-hooded-sweatshirt'
  UNION ALL SELECT id, 'SIZE', 'XL',  1799.00, 15, 1, 4 FROM products WHERE slug = 'premium-hooded-sweatshirt'
  UNION ALL SELECT id, 'SIZE', 'XXL', 1899.00, 5,  1, 5 FROM products WHERE slug = 'premium-hooded-sweatshirt';

-- Polo Shirt — SIZE
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'SIZE', 'S',   799.00, 25, 1, 1 FROM products WHERE slug = 'classic-polo-shirt'
  UNION ALL SELECT id, 'SIZE', 'M',   799.00, 40, 1, 2 FROM products WHERE slug = 'classic-polo-shirt'
  UNION ALL SELECT id, 'SIZE', 'L',   799.00, 45, 1, 3 FROM products WHERE slug = 'classic-polo-shirt'
  UNION ALL SELECT id, 'SIZE', 'XL',  799.00, 30, 1, 4 FROM products WHERE slug = 'classic-polo-shirt'
  UNION ALL SELECT id, 'SIZE', 'XXL', 849.00, 10, 1, 5 FROM products WHERE slug = 'classic-polo-shirt';

-- Yoga Mat — DESIGN (colour)
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'DESIGN', 'Midnight Black', 1199.00, 20, 1, 1 FROM products WHERE slug = 'yoga-mat-6mm'
  UNION ALL SELECT id, 'DESIGN', 'Ocean Blue',    1199.00, 20, 1, 2 FROM products WHERE slug = 'yoga-mat-6mm'
  UNION ALL SELECT id, 'DESIGN', 'Coral Pink',    1199.00, 20, 1, 3 FROM products WHERE slug = 'yoga-mat-6mm'
  UNION ALL SELECT id, 'DESIGN', 'Forest Green',  1199.00, 15, 1, 4 FROM products WHERE slug = 'yoga-mat-6mm'
  UNION ALL SELECT id, 'DESIGN', 'Lavender',      1199.00, 15, 1, 5 FROM products WHERE slug = 'yoga-mat-6mm';

-- Insulated Bottle — DESIGN (colour)
INSERT INTO product_variants (product_id, type, value, price, stock_quantity, is_active, sort_order)
  SELECT id, 'DESIGN', 'Matte Black',   799.00, 30, 1, 1 FROM products WHERE slug = 'insulated-water-bottle-1l'
  UNION ALL SELECT id, 'DESIGN', 'Arctic White',  799.00, 30, 1, 2 FROM products WHERE slug = 'insulated-water-bottle-1l'
  UNION ALL SELECT id, 'DESIGN', 'Navy Blue',     799.00, 35, 1, 3 FROM products WHERE slug = 'insulated-water-bottle-1l'
  UNION ALL SELECT id, 'DESIGN', 'Forest Green',  799.00, 35, 1, 4 FROM products WHERE slug = 'insulated-water-bottle-1l';

-- ─── Orders ───────────────────────────────────────────────────────────────────

-- Order 1: Rahul — DELIVERED, PAID (Wireless Headphones)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0001', id, 'DELIVERED', 'PAID', 6999.00, 0.00, 6999.00,
    'Rahul Sharma', '9876543210', '42 MG Road', 'Koramangala', 'Bengaluru', 'Karnataka', '560034', 'India',
    '2025-03-10 10:30:00'
  FROM users WHERE email = 'rahul.sharma@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 6999.00, 6999.00
  FROM orders o, products p
  WHERE o.order_number = 'ORD-2025-0001' AND p.slug = 'wireless-headphones';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 6999.00, 'INR', 'SUCCESS', 'UPI', '2025-03-10 10:32:00'
  FROM orders WHERE order_number = 'ORD-2025-0001';

INSERT INTO shipments (order_id, courier_name, status, shipped_at, delivered_at, created_at)
  SELECT id, 'BlueDart', 'DELIVERED', '2025-03-12 09:00:00', '2025-03-15 14:30:00', '2025-03-12 08:00:00'
  FROM orders WHERE order_number = 'ORD-2025-0001';

-- Order 2: Priya — SHIPPED, PAID (Bluetooth Speaker + Vitamin C Serum)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0002', id, 'SHIPPED', 'PAID', 2398.00, 0.00, 2398.00,
    'Priya Patel', '9123456789', '15 Navrangpura', 'Ahmedabad', 'Gujarat', '380009', 'India',
    '2025-04-02 14:15:00'
  FROM users WHERE email = 'priya.patel@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 1499.00, 1499.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0002' AND p.slug = 'bluetooth-portable-speaker';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 899.00, 899.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0002' AND p.slug = 'vitamin-c-face-serum';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 2398.00, 'INR', 'SUCCESS', 'CARD', '2025-04-02 14:17:00'
  FROM orders WHERE order_number = 'ORD-2025-0002';

INSERT INTO shipments (order_id, courier_name, awb_code, status, shipped_at, created_at)
  SELECT id, 'Delhivery', 'DL99887766554', 'IN_TRANSIT', '2025-04-04 10:00:00', '2025-04-04 09:00:00'
  FROM orders WHERE order_number = 'ORD-2025-0002';

-- Order 3: Amit — PROCESSING, PAID (4K Monitor)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0003', id, 'PROCESSING', 'PAID', 21999.00, 0.00, 21999.00,
    'Amit Kumar', '8765432109', '7/B Lajpat Nagar', 'Block C', 'New Delhi', 'Delhi', '110024', 'India',
    '2025-04-20 09:45:00'
  FROM users WHERE email = 'amit.kumar@outlook.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 21999.00, 21999.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0003' AND p.slug = '27inch-4k-monitor';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 21999.00, 'INR', 'SUCCESS', 'NET_BANKING', '2025-04-20 09:47:00'
  FROM orders WHERE order_number = 'ORD-2025-0003';

-- Order 4: Sneha — CONFIRMED, PAID (Atomic Habits + Clean Code)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0004', id, 'CONFIRMED', 'PAID', 1098.00, 50.00, 1148.00,
    'Sneha Singh', '7654321098', '22 Anna Salai', 'Chennai', 'Tamil Nadu', '600002', 'India',
    '2025-04-25 16:00:00'
  FROM users WHERE email = 'sneha.singh@yahoo.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 449.00, 449.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0004' AND p.slug = 'atomic-habits';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 649.00, 649.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0004' AND p.slug = 'clean-code';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 1148.00, 'INR', 'SUCCESS', 'UPI', '2025-04-25 16:02:00'
  FROM orders WHERE order_number = 'ORD-2025-0004';

-- Order 5: Vikram — PLACED, PENDING (Yoga Mat + Resistance Bands)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0005', id, 'PLACED', 'PENDING', 1998.00, 0.00, 1998.00,
    'Vikram Nair', '9988776655', '8 Marine Drive', 'Mumbai', 'Maharashtra', '400020', 'India',
    '2025-04-28 11:20:00'
  FROM users WHERE email = 'vikram.nair@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 1199.00, 1199.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0005' AND p.slug = 'yoga-mat-6mm';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 799.00, 799.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0005' AND p.slug = 'resistance-bands-set';

-- Order 6: Rahul — DELIVERED, PAID (USB-C Hub + Earbuds Pro)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0006', id, 'DELIVERED', 'PAID', 3598.00, 0.00, 3598.00,
    'Rahul Sharma', '9876543210', '42 MG Road', 'Koramangala', 'Bengaluru', 'Karnataka', '560034', 'India',
    '2025-02-14 18:00:00'
  FROM users WHERE email = 'rahul.sharma@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 1299.00, 1299.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0006' AND p.slug = 'usbc-hub-7in1';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 2299.00, 2299.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0006' AND p.slug = 'true-wireless-earbuds-pro';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 3598.00, 'INR', 'SUCCESS', 'CARD', '2025-02-14 18:03:00'
  FROM orders WHERE order_number = 'ORD-2025-0006';

INSERT INTO shipments (order_id, courier_name, status, shipped_at, delivered_at, created_at)
  SELECT id, 'FedEx', 'DELIVERED', '2025-02-16 08:00:00', '2025-02-19 13:00:00', '2025-02-16 07:00:00'
  FROM orders WHERE order_number = 'ORD-2025-0006';

-- Order 7: Priya — CANCELLED, REFUNDED (Dumbbell Set)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0007', id, 'CANCELLED', 'REFUNDED', 3499.00, 0.00, 3499.00,
    'Priya Patel', '9123456789', '15 Navrangpura', 'Ahmedabad', 'Gujarat', '380009', 'India',
    '2025-03-22 12:00:00'
  FROM users WHERE email = 'priya.patel@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 3499.00, 3499.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0007' AND p.slug = 'adjustable-dumbbell-set';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 3499.00, 'INR', 'REFUNDED', 'UPI', '2025-03-22 12:05:00'
  FROM orders WHERE order_number = 'ORD-2025-0007';

-- Order 8: Amit — DELIVERED, PAID (Classic White T-Shirt M×2 + Deep Work)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0008', id, 'DELIVERED', 'PAID', 1997.00, 0.00, 1997.00,
    'Amit Kumar', '8765432109', '7/B Lajpat Nagar', 'Block C', 'New Delhi', 'Delhi', '110024', 'India',
    '2025-01-05 09:00:00'
  FROM users WHERE email = 'amit.kumar@outlook.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price, variant_type, variant_value)
  SELECT o.id, p.id, p.name, p.sku, 2, 799.00, 1598.00, 'SIZE', 'M'
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0008' AND p.slug = 'classic-white-t-shirt';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 399.00, 399.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0008' AND p.slug = 'deep-work';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 1997.00, 'INR', 'SUCCESS', 'UPI', '2025-01-05 09:02:00'
  FROM orders WHERE order_number = 'ORD-2025-0008';

INSERT INTO shipments (order_id, courier_name, status, shipped_at, delivered_at, created_at)
  SELECT id, 'DTDC', 'DELIVERED', '2025-01-07 10:00:00', '2025-01-10 16:00:00', '2025-01-07 09:00:00'
  FROM orders WHERE order_number = 'ORD-2025-0008';

-- Order 9: Sneha — SHIPPED, PAID (LED Desk Lamp + Coffee Mug Set)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0009', id, 'SHIPPED', 'PAID', 2498.00, 0.00, 2498.00,
    'Sneha Singh', '7654321098', '22 Anna Salai', 'Chennai', 'Tamil Nadu', '600002', 'India',
    '2025-04-27 15:30:00'
  FROM users WHERE email = 'sneha.singh@yahoo.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 1599.00, 1599.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0009' AND p.slug = 'led-desk-lamp';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 899.00, 899.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0009' AND p.slug = 'ceramic-mug-set-4';

INSERT INTO payments (order_id, amount, currency, status, method, created_at)
  SELECT id, 2498.00, 'INR', 'SUCCESS', 'CARD', '2025-04-27 15:32:00'
  FROM orders WHERE order_number = 'ORD-2025-0009';

INSERT INTO shipments (order_id, courier_name, awb_code, status, shipped_at, created_at)
  SELECT id, 'Ekart', 'EK44332211009', 'IN_TRANSIT', '2025-04-29 08:00:00', '2025-04-29 07:30:00'
  FROM orders WHERE order_number = 'ORD-2025-0009';

-- Order 10: Vikram — PLACED, PENDING (GaN Charger + Insulated Bottle Navy Blue)
INSERT INTO orders (order_number, user_id, status, payment_status, subtotal, shipping_amount, total_amount,
  shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  created_at)
  SELECT 'ORD-2025-0010', id, 'PLACED', 'PENDING', 2698.00, 0.00, 2698.00,
    'Vikram Nair', '9988776655', '8 Marine Drive', 'Mumbai', 'Maharashtra', '400020', 'India',
    '2025-04-30 20:10:00'
  FROM users WHERE email = 'vikram.nair@gmail.com';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT o.id, p.id, p.name, p.sku, 1, 1899.00, 1899.00
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0010' AND p.slug = '65w-gan-fast-charger';

INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price, variant_type, variant_value)
  SELECT o.id, p.id, p.name, p.sku, 1, 799.00, 799.00, 'DESIGN', 'Navy Blue'
  FROM orders o, products p WHERE o.order_number = 'ORD-2025-0010' AND p.slug = 'insulated-water-bottle-1l';

-- ─── Testimonials ─────────────────────────────────────────────────────────────
INSERT INTO testimonials (name, designation, company, content, rating, sort_order, is_active) VALUES
  ('Rahul Sharma',  'Software Engineer',     'Infosys',        'The wireless headphones are amazing! Crystal clear sound and the noise-cancellation is top-notch. Delivered in just 3 days. Highly recommend this store!', 5, 1, 1),
  ('Priya Patel',   'Graphic Designer',      'Freelancer',     'Ordered the Bluetooth speaker and the Vitamin C serum. Both arrived well-packaged and exactly as described. The speaker quality blew me away for the price!', 5, 2, 1),
  ('Amit Kumar',    'Product Manager',       'Flipkart',       'Bought the 4K monitor — setup was seamless, colors are gorgeous. Genuine product, great price. Customer support was super helpful when I had a query.',        5, 3, 1),
  ('Sneha Singh',   'Teacher',               'Self-employed',  'Love the ceramic mug set — the packaging was so premium it felt like a luxury gift. Already ordered two more sets for friends. Fast shipping to Chennai!',      5, 4, 1),
  ('Vikram Nair',   'Fitness Trainer',       'Gold''s Gym',    'Yoga mat is solid — great grip and the alignment lines are genuinely useful. The resistance bands are tough and stretchy. My whole studio uses these now.',       5, 5, 1),
  ('Divya Menon',   'Content Creator',       'YouTube',        'The GaN charger is a game-changer — charges my MacBook, phone, and iPad simultaneously. Compact enough to fit in my camera bag. 10/10 purchase.',              5, 6, 1),
  ('Karan Mehta',   'Data Analyst',          'Deloitte',       'Clean Code book changed how I write code professionally. Delivery was fast and the book condition was perfect. Will definitely order more technical books here.', 4, 7, 1),
  ('Anjali Reddy',  'Skincare Enthusiast',   'Nykaa',          'The Vitamin C serum actually works! Noticed a visible difference in 3 weeks. The moisturizer with SPF is perfect for daily use. Genuine products, great prices.', 5, 8, 1);

-- ─── Banners ──────────────────────────────────────────────────────────────────
INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES
  ('Summer Sale — Up to 40% Off',
   'Shop the hottest deals of the season on electronics, fashion, and more.',
   'https://picsum.photos/seed/banner-summer/1400/600',
   '/products', 1, 1),
  ('New Arrivals: Sports & Fitness',
   'Elevate your workout with our latest yoga mats, resistance bands, and dumbbells.',
   'https://picsum.photos/seed/banner-sports/1400/600',
   '/categories/sports-fitness', 2, 1),
  ('Top-Rated Skincare',
   'Dermatologist-tested Vitamin C serums and SPF moisturizers. Glow up today.',
   'https://picsum.photos/seed/banner-beauty/1400/600',
   '/categories/beauty-personal-care', 3, 1),
  ('Books That Change Lives',
   'Atomic Habits, Clean Code, Deep Work — build the life you want, one page at a time.',
   'https://picsum.photos/seed/banner-books/1400/600',
   '/categories/books', 4, 1);

-- ─── CMS Pages ────────────────────────────────────────────────────────────────
INSERT INTO cms_pages (title, slug, content, excerpt, status, meta_title, meta_description) VALUES
  ('About Us',
   'about-us',
   '<h2>Our Story</h2><p>Founded in 2022, we are a passionate team dedicated to bringing you the best quality products at honest prices. From electronics to personal care, every item in our store is handpicked for quality and value.</p><h2>Our Mission</h2><p>We believe shopping online should be simple, trustworthy, and delightful. Free shipping on orders above ₹999, easy 7-day returns, and 24/7 support — because you deserve nothing less.</p><h2>Genuine Products, Always</h2><p>Every product is sourced directly from verified manufacturers and authorised distributors. What you see is exactly what you get.</p>',
   'Learn about our story, mission, and commitment to quality.',
   'PUBLISHED', 'About Us', 'Learn about our story, mission, and commitment to bringing you genuine products at great prices.'),

  ('Privacy Policy',
   'privacy-policy',
   '<h2>Privacy Policy</h2><p>Last updated: January 2025</p><h3>Information We Collect</h3><p>We collect information you provide when creating an account, placing orders, or contacting support — including name, email, phone number, and shipping address.</p><h3>How We Use Your Information</h3><p>Your information is used solely to process orders, provide customer support, and improve your shopping experience. We never sell your data to third parties.</p><h3>Cookies</h3><p>We use essential cookies to keep you logged in and remember your cart. Analytics cookies help us understand how to improve the store.</p><h3>Contact</h3><p>For privacy queries, email us at privacy@example.com.</p>',
   'How we collect, use and protect your personal information.',
   'PUBLISHED', 'Privacy Policy', 'Read our privacy policy to understand how we handle your personal data.'),

  ('Terms & Conditions',
   'terms-and-conditions',
   '<h2>Terms & Conditions</h2><p>By using this website you agree to these terms. Please read them carefully.</p><h3>Orders</h3><p>All orders are subject to product availability. We reserve the right to cancel any order and provide a full refund if a product becomes unavailable.</p><h3>Pricing</h3><p>Prices are listed in Indian Rupees (₹). We reserve the right to change prices at any time without prior notice.</p><h3>Returns</h3><p>Products may be returned within 7 days of delivery in original, unused condition. See our Return Policy for details.</p><h3>Limitation of Liability</h3><p>We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>',
   'Terms governing the use of this website and purchase of products.',
   'PUBLISHED', 'Terms & Conditions', 'Read the terms and conditions that govern your use of our store and purchase of products.'),

  ('Return & Refund Policy',
   'return-policy',
   '<h2>Return & Refund Policy</h2><h3>7-Day Return Window</h3><p>You may return any product within 7 days of delivery. Items must be unused, in original packaging, with all tags and accessories intact.</p><h3>How to Initiate a Return</h3><ol><li>Contact our support team via WhatsApp or email within 7 days of delivery.</li><li>Share your order number and reason for return.</li><li>We will arrange a free pickup within 2 business days.</li></ol><h3>Refund Timeline</h3><p>Once we receive and inspect the returned product, refunds are processed within 5–7 business days to the original payment method.</p><h3>Non-Returnable Items</h3><p>Opened personal care products, digital downloads, and custom-printed items cannot be returned.</p>',
   'Our hassle-free 7-day return and refund policy.',
   'PUBLISHED', 'Return & Refund Policy', 'Learn about our 7-day hassle-free return policy and how to get a full refund.');

-- ─── Gallery Images ───────────────────────────────────────────────────────────
INSERT INTO gallery_images (url, alt_text, title, sort_order) VALUES
  ('https://picsum.photos/seed/gallery-store1/800/600',  'Our store interior',         'Store Interior',         1),
  ('https://picsum.photos/seed/gallery-team1/800/600',   'Our team',                   'The Team',               2),
  ('https://picsum.photos/seed/gallery-pack1/800/600',   'Quality packaging',          'Packaging Process',      3),
  ('https://picsum.photos/seed/gallery-warehouse1/800/600','Warehouse operations',     'Warehouse',              4),
  ('https://picsum.photos/seed/gallery-product1/800/600','Featured product showcase',  'Product Showcase 1',     5),
  ('https://picsum.photos/seed/gallery-product2/800/600','Featured product showcase',  'Product Showcase 2',     6),
  ('https://picsum.photos/seed/gallery-customer1/800/600','Happy customers',           'Happy Customers',        7),
  ('https://picsum.photos/seed/gallery-delivery1/800/600','Fast delivery service',     'Delivery',               8),
  ('https://picsum.photos/seed/gallery-eco1/800/600',    'Eco-friendly packaging',     'Eco Packaging',          9),
  ('https://picsum.photos/seed/gallery-award1/800/600',  'Quality awards',             'Quality Awards',        10);

-- ─── Update Settings ─────────────────────────────────────────────────────────
UPDATE settings SET setting_value = 'BoltBlazer Store'         WHERE setting_key = 'store_name';
UPDATE settings SET setting_value = 'boltblazers.tech@gmail.com' WHERE setting_key = 'store_email';
UPDATE settings SET setting_value = '+91 98765 43210'           WHERE setting_key = 'store_phone';
UPDATE settings SET setting_value = '999'                       WHERE setting_key = 'free_shipping_threshold';
UPDATE settings SET setting_value = '49'                        WHERE setting_key = 'default_shipping_cost';
