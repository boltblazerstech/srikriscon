-- Update banners with Cloudflare R2 URLs
DELETE FROM banners;

INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES 
('Premium Industrial Solutions', 'Srikriscon: Your partner in quality packaging and industrial safety.', 'https://pub-9733d2c30f73416992df2fa56e6ebe5f.r2.dev/banner-images/banner1.webp', '/products', 0, TRUE),
('Global Logistics Excellence', 'Streamlining supply chains with state-of-the-art tracking and management.', 'https://pub-9733d2c30f73416992df2fa56e6ebe5f.r2.dev/banner-images/banner2.webp', '/blog/optimizing-supply-chain-festive-seasons', 1, TRUE),
('Safety First, Always', 'Certified industrial safety gear designed for the toughest work environments.', 'https://pub-9733d2c30f73416992df2fa56e6ebe5f.r2.dev/banner-images/banner3.webp', '/categories/safety', 2, TRUE);
