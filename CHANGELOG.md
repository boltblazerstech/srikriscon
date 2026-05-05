# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-04-25

### Initial Release

Complete full-stack ecommerce monorepo boilerplate — production-ready, white-label.

#### Backend (Spring Boot 3.2 / Java 17)

- **Auth** — JWT access + refresh token pair; `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`; password reset via email token
- **Admin auth** — separate `/api/admin/auth/login` with `ADMIN` / `SUPER_ADMIN` roles
- **Products** — full CRUD; variants (nested); slug auto-generation; featured flag; stock tracking; soft-delete; image list (R2 URLs)
- **Categories** — CRUD with slug, optional image, active flag
- **Orders** — placed by customers; status machine (`PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`); cancellation; refund trigger
- **Payments** — Razorpay order creation and webhook verification; idempotent payment capture
- **Shipping** — Shiprocket integration for AWB generation and tracking; shipment record stored per order
- **Customers** — registration, email verification, login, profile update, address book
- **Gallery** — multi-image upload with drag-reorder
- **Banners** — hero banner CRUD with sort order
- **Testimonials** — customer review CRUD with rating
- **CMS Pages** — rich-text pages (About, Privacy Policy, Terms, Shipping Policy) editable via admin
- **Store Settings** — single-row settings table for store name, contact info, social links, integrations
- **Admin Users** — SUPER_ADMIN can create / deactivate ADMIN accounts
- **File upload** — single and batch upload to Cloudflare R2 via AWS SDK S3-compatible client
- **Email** — order confirmation, shipment notification, password reset — HTML templates via Spring Mail
- **Flyway** — versioned schema migrations; `V1` creates all tables; `V2` seeds default admin + sample data
- **OpenAPI** — Swagger UI at `/swagger-ui.html`; machine-readable spec at `/api-docs`

#### Storefront (Next.js 15 / React 19)

- Home page — hero banner slider, featured categories, featured products, Why Choose Us, CTA, testimonials
- Product listing — server-side filtering by category, search, price range, pagination
- Product detail — image gallery, variant selector, add-to-cart, quantity picker, related products
- Cart — slide-over drawer, quantity update, remove, subtotal
- Checkout — address form, shipping estimate, Razorpay payment sheet
- Order confirmation — success state with order number
- Order tracking — status timeline by order number
- Customer account — login, register, profile, address book, order history
- Static pages — About, Privacy Policy, Terms, Shipping Policy (content from CMS)
- SEO — `sitemap.xml`, `robots.txt`, per-page `metadata` with Open Graph

#### Admin Panel (Next.js 15 / React 19)

- Dashboard — stats cards (revenue, orders, products, customers), sales bar chart, status breakdown, recent orders table
- Products — list with search + category filter; add / edit form with rich-text description, multi-image upload + drag reorder, dynamic variants, SEO fields
- Categories — list + add / edit modal with image upload and slug auto-generation
- Orders — list with status filter; detail page with status updater, shipment management, refund trigger, customer and address cards
- Gallery — drag-reorder image grid + bulk upload dropzone
- CMS Pages — list + rich-text editor with SEO fields
- Banners — drag-reorder list + add / edit modal
- Testimonials — list + add / edit modal with inline star rating picker
- Settings — tabbed form: General (name, tagline, logo, favicon, currency, shipping), Contact, Social, Integrations (Razorpay key, Google Analytics)
- Users — SUPER_ADMIN only; list + add / edit modal; self-delete guard

#### Infrastructure

- Multi-stage Dockerfiles for all three services (Maven → JRE 17 for backend; Node build → standalone for Next.js apps)
- `docker-compose.yml` — MySQL 8 with named volume; backend waits for MySQL health check; storefront + admin wait for backend health check
- `output: "standalone"` enabled on both Next.js apps for minimal Docker images
- Root `.env.example` with every variable documented and grouped
- `README.md` — architecture diagram, tech stack table, local dev setup, Docker Compose guide, deployment instructions for Render + Aiven + Vercel (Option A) and AWS ECS (Option B)
- `FORKING_GUIDE.md` — step-by-step white-label setup; what-changes-per-client checklist; go-live checklist
