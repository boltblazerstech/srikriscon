-- ─── Make variant price nullable to inherit product price ────────────────────
ALTER TABLE product_variants MODIFY COLUMN price DECIMAL(10,2) NULL;
