-- ─── Admin Users ──────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name  VARCHAR(100),
    role       VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
    is_active  SMALLINT     NOT NULL DEFAULT 1,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_admin_users_email UNIQUE (email)
);

-- ─── Password Reset Tokens ────────────────────────────────────────────────────
CREATE TABLE password_reset_tokens (
    id         BIGSERIAL PRIMARY KEY,
    token      VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    user_type  VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER | ADMIN
    expires_at TIMESTAMP    NOT NULL,
    used       SMALLINT     NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_prt_token UNIQUE (token)
);

CREATE INDEX idx_prt_email ON password_reset_tokens(email);

-- ─── Alter refresh_tokens to support admin refresh tokens ─────────────────────
ALTER TABLE refresh_tokens ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE refresh_tokens ADD COLUMN admin_user_id BIGINT NULL;
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_admin
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE;

-- ─── Default super-admin (password: SuperAdmin@123) ──────────────────────────
-- Hash generated with BCrypt strength 10; CHANGE THIS before going to production
INSERT INTO admin_users (email, password, first_name, last_name, role) VALUES
    ('superadmin@example.com',
     '$2a$10$4uDPBGBvHIpYAbmf3sOQ4.gSjYwnbq1I5.TL7OoFi/xzXJb3GI.8i',
     'Super', 'Admin', 'SUPER_ADMIN');
