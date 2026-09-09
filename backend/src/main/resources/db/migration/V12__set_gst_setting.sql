-- ─── V12: Persist GSTIN setting ────────────────────────────────────────────────
INSERT INTO settings (setting_key, setting_value, setting_group, description, is_public, created_at, updated_at)
VALUES ('gst_number', '23DZAPS6347N1ZU', 'general', 'GSTIN of business', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE setting_value = '23DZAPS6347N1ZU', is_public = 1, updated_at = NOW();
