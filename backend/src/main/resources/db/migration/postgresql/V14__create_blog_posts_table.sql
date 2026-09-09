-- ─── Blog Posts ───────────────────────────────────────────────────────────────
CREATE TABLE blog_posts (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    excerpt     TEXT,
    content     TEXT         NOT NULL,
    category    VARCHAR(100),
    author      VARCHAR(100),
    image_url   VARCHAR(512),
    read_time   VARCHAR(50),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_blog_post_slug UNIQUE (slug)
);

-- ─── Seed Blog Posts ───────────────────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, image_url, read_time, created_at)
VALUES 
('The Art of Sustainable Packaging in Modern E-commerce', 
 'sustainable-packaging-modern-ecommerce', 
 'Discover how eco-friendly materials are reshaping the way we think about product protection and brand identity.', 
 'Detailed content about sustainable packaging...', 
 'Insights', 
 'Aditya Sharma', 
 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop', 
 '5 min read', 
 '2024-05-12 00:00:00'),

('10 Essential Safety Standards for Industrial Equipment', 
 'safety-standards-industrial-equipment', 
 'A comprehensive guide to ensuring your workspace meets the highest safety certifications for heavy-duty machinery.', 
 'Detailed content about industrial safety...', 
 'Safety', 
 'Rajesh Kumar', 
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', 
 '8 min read', 
 '2024-05-10 00:00:00'),

('Optimizing Your Supply Chain for Peak Festive Seasons', 
 'optimizing-supply-chain-festive-seasons', 
 'How to handle high demand and logistics challenges during India''s busiest shopping periods without breaking a sweat.', 
 'Detailed content about logistics...', 
 'Logistics', 
 'Priya Das', 
 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop', 
 '6 min read', 
 '2024-05-05 00:00:00');
