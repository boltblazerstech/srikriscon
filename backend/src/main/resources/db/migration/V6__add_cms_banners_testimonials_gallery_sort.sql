-- Banners
CREATE TABLE banners (
    id         BIGSERIAL    PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    subtitle   VARCHAR(500),
    image_url  VARCHAR(512) NOT NULL,
    link_url   VARCHAR(512),
    sort_order INT          NOT NULL DEFAULT 0,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE testimonials (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    company     VARCHAR(255),
    content     TEXT         NOT NULL,
    rating      SMALLINT     NOT NULL DEFAULT 5,
    image_url   VARCHAR(512),
    sort_order  INT          NOT NULL DEFAULT 0,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Gallery sort order
ALTER TABLE gallery_images
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0;
