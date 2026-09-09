-- ─── Seed/Update About Us CMS Page (MySQL) ──────────────────────────────────
INSERT INTO cms_pages (title, slug, content, excerpt, status, meta_title, meta_description) VALUES (
    'About Us',
    'about-us',
    '<h2>About Us</h2><p><strong>Sri Kriscon Industries</strong> was established in 2017 with a clear vision to serve the packaging industry across various markets, providing innovative and reliable packaging solutions.</p><p>We specialize in catering to diverse packaging demands of our clients, ensuring quality, safety, and a strong brand presence for their products.</p><p>Equipped with advanced printing technology and high-precision manufacturing, we maintain consistent product quality, enabling us to handle bulk orders as well as customized requirements efficiently.</p><p>At Sri Kriscon Industries, we believe packaging is not just protection—it is a powerful brand asset. Our focus is on delivering solutions that combine structural integrity, visual appeal, and environmental responsibility, helping our clients stand out in competitive markets worldwide.</p><blockquote class="my-6 border-l-4 border-pink-600 pl-4 italic font-medium">"We are a trusted partner for food and industrial packaging solutions."</blockquote><h2>What We Do</h2><p>We specialize in manufacturing custom packaging solutions designed to protect the product, enhance shelf presence, and strengthen brand identity.</p><h3>Our Offerings Include:</h3><ul><li><strong>Custom paper and corrugated packaging solutions:</strong> Tailored paper cartons, mono cartons, corrugated boxes, and rigid packaging.</li><li><strong>Brand-centric customized packaging support:</strong> End-to-end design and printing support aligned with your brand guidelines.</li><li><strong>Bulk and customized production:</strong> High-precision manufacturing equipped to handle large-volume industrial bulk orders and custom requests.</li></ul>',
    'Sri Kriscon Industries was established in 2017, providing innovative and reliable packaging solutions.',
    'PUBLISHED',
    'About Us - Sri Kriscon Industries',
    'Sri Kriscon Industries was established in 2017, providing innovative and reliable packaging solutions.'
)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    content = VALUES(content),
    excerpt = VALUES(excerpt),
    status = VALUES(status),
    meta_title = VALUES(meta_title),
    meta_description = VALUES(meta_description);
