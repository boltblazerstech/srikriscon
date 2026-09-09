-- Fix super-admin password hash (SuperAdmin@123)
UPDATE admin_users
SET password = '$2b$10$roYj2OASMMlyP1JlObMUYOlfS81NtaLH/ctY0C/a0p/Mo/UiBL4Gq'
WHERE email = 'superadmin@example.com';
