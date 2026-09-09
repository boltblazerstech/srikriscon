-- ─── Make variant price nullable to inherit product price ────────────────────
ALTER TABLE product_variants ALTER COLUMN price DROP NOT NULL;
