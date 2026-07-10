-- ─── V11: Update store settings with real business details ────────────────────
-- Never edit applied migrations (V1–V10). Use UPDATE statements in new versions.

UPDATE settings SET setting_value = 'Sri Kriscon'        WHERE setting_key = 'store_name';
UPDATE settings SET setting_value = 'info@srikriscon.com' WHERE setting_key = 'store_email';
UPDATE settings SET setting_value = '7999921111'          WHERE setting_key = 'store_phone';
