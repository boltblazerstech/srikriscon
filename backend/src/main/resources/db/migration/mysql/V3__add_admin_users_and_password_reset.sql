-- ─── Admin Users ──────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
    id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name  VARCHAR(100),
    role       VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Password Reset Tokens ────────────────────────────────────────────────────
CREATE TABLE password_reset_tokens (
    id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    user_type  VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER | ADMIN
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_prt_token (token),
    INDEX      idx_prt_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Alter refresh_tokens to support admin refresh tokens ─────────────────────
ALTER TABLE refresh_tokens
    MODIFY COLUMN user_id BIGINT NULL,
    ADD COLUMN admin_user_id BIGINT NULL AFTER user_id,
    ADD CONSTRAINT fk_refresh_admin
        FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE;

-- ─── Default super-admin (password: SuperAdmin@123) ──────────────────────────
-- Hash generated with BCrypt strength 10; CHANGE THIS before going to production
INSERT INTO admin_users (email, password, first_name, last_name, role) VALUES
    ('superadmin@example.com',
     '$2a$10$4uDPBGBvHIpYAbmf3sOQ4.gSjYwnbq1I5.TL7OoFi/xzXJb3GI.8i',
     'Super', 'Admin', 'SUPER_ADMIN');
