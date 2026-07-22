-- Clean out old dummy testimonials
DELETE FROM testimonials;

-- Insert product-relevant testimonials
INSERT INTO testimonials (name, designation, company, content, rating, sort_order, is_active) VALUES
  ('Rahul Sharma',  'Purchase Manager',       'AutoParts India',   'The double-wall corrugated boxes from Sri Kriscon are extremely durable. Since switching, we have had zero transit damage reports for our heavy gearboxes.', 5, 1, 1),
  ('Priya Patel',   'Founder',                'CraftyGifts',       'Excellent custom-printed corrugated boxes. Our logos are printed clean, clear, and perfectly aligned. The low MOQ was a lifesaver for our small business.', 5, 2, 1),
  ('Amit Kumar',    'Logistics Head',          'Dewas Organics',    'Superb quality packaging rolls. They provide excellent cushioning and wrap around our irregular industrial components smoothly.', 5, 3, 1),
  ('Sneha Singh',   'Operations Director',     'AgriFresh Exports', 'Their moisture-resistant boxes are perfect for our fruit exports. The stack strength is incredible under humid cold-storage conditions.', 5, 4, 1),
  ('Vikram Nair',   'Owner',                  'Nair Packers',      'Sri Kriscon is our go-to for packaging sheets and heavy-duty 5-ply cardboard boxes. Extremely sturdy and cost-effective!', 5, 5, 1),
  ('Divya Menon',   'Procurement Head',        'Indo Logistics',    'Quick turnaround times and reliable delivery to Indore. Their corrugated boxes match international packaging standards.', 5, 6, 1),
  ('Karan Mehta',   'Manager',                 'E-Store Logistics', 'Highly recommend their self-locking boxes. It saves our packing team time and adhesive tape cost. Top quality!', 4, 7, 1),
  ('Anjali Reddy',  'Supply Chain Specialist', 'MedPharma',        'Excellent customer service and prompt delivery. The customized size packaging boxes match our pharmaceutical bottles perfectly.', 5, 8, 1);
