-- Reset superadmin password to: SuperAdmin@123
UPDATE admin_users
SET password = '$2a$10$fzhG0F8l/L9T/gkWcX7l..zzCmfdxw9X4FXHNu4o2TC.MmwZSGRAm'
WHERE email = 'superadmin@example.com';
