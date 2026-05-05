# Ecommerce Store — Monorepo Boilerplate

A production-ready, full-stack ecommerce monorepo. White-label — clone once, skin per client.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                      │
│   ├── storefront  (Next.js 15, port 3000)  — customers       │
│   └── admin       (Next.js 15, port 3001)  — staff           │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST / JSON
          ┌───────▼────────┐
          │  Spring Boot 3  │  port 8080
          │  (Java 17)      │
          └───────┬────────┘
                  │ JPA / Flyway
          ┌───────▼────────┐        ┌──────────────┐
          │   MySQL 8       │        │ Cloudflare R2 │
          └────────────────┘        │  (images)     │
                                    └──────────────┘
```

**External services:** Razorpay (payments), Shiprocket (shipping), SMTP (email), Cloudflare R2 (object storage).

## Tech Stack

| Layer | Technology |
|---|---|
| Storefront | Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion |
| Admin panel | Next.js 15 (App Router), React 19, Tailwind CSS, TanStack Query v5 |
| Backend API | Spring Boot 3.2, Java 17, Spring Security, JPA / Hibernate |
| Database | MySQL 8 with Flyway migrations |
| Payments | Razorpay |
| Shipping | Shiprocket |
| Storage | Cloudflare R2 (S3-compatible) |
| Auth | JWT (access + refresh tokens) |
| Email | SMTP (Gmail / any provider) |

## Project Structure

```
.
├── storefront/          # Customer-facing Next.js app (port 3000)
├── admin/               # Admin dashboard Next.js app (port 3001)
├── backend/             # Spring Boot REST API (port 8080)
├── database/
│   ├── migrations/      # Flyway SQL files — source of truth for schema
│   └── flyway.conf      # Flyway CLI config for standalone runs
├── docker-compose.yml
├── .env.example
├── FORKING_GUIDE.md
└── CHANGELOG.md
```

## Local Development Setup

### Prerequisites

- Java 17+, Maven 3.9+
- Node.js 20+
- MySQL 8 running locally (or Docker)
- [Flyway CLI](https://documentation.red-gate.com/fd/command-line-184127404.html) (optional)

### 1. Clone and configure

```bash
git clone https://github.com/your-org/ecommerce-boilerplate.git
cd ecommerce-boilerplate
cp .env.example .env
# Fill in every value in .env before continuing
```

### 2. Create the database

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ecommerce_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
```

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
# API at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

Flyway applies all migrations in `database/migrations/` automatically on first startup.

### 4. Run the storefront

```bash
cd storefront
npm install
npm run dev   # http://localhost:3000
```

### 5. Run the admin panel

```bash
cd admin
npm install
npm run dev   # http://localhost:3001
```

### First admin login

Flyway seed data (`V2__seed_initial_data.sql`) creates a default super admin:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@123` |

**Change this password immediately** via Settings → Users in the admin panel.

## Running with Docker Compose

```bash
cp .env.example .env
# Fill in all values — especially DB_ROOT_PASSWORD and JWT_SECRET

docker compose up --build
```

Services start in dependency order: MySQL → Backend → Storefront + Admin.

| Service | URL |
|---|---|
| Storefront | http://localhost:3000 |
| Admin panel | http://localhost:3001 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

```bash
docker compose down      # stop, keep MySQL data volume
docker compose down -v   # stop and delete MySQL data
```

## Deployment

### Option A — Managed Services (recommended)

| Component | Provider | Notes |
|---|---|---|
| Backend | [Render](https://render.com) | Docker deploy; free tier available |
| MySQL | [Aiven](https://aiven.io) | Free 1-node starter |
| Storefront | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Edge-optimised |
| Admin | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Separate site |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) | Free 10 GB/month egress |

**Steps:**

1. **Aiven MySQL** — create a MySQL 8 service, copy the DSN into your env vars.
2. **Render backend** — New Web Service → Docker → root `./backend`. Set all backend env vars from `.env.example`.
3. **Vercel storefront** — import repo, set root to `storefront`, add `NEXT_PUBLIC_*` env vars.
4. **Vercel admin** — same, root set to `admin`, add `NEXT_PUBLIC_API_URL`.
5. Update `CORS_ALLOWED_ORIGINS` to include the live storefront and admin URLs.
6. Update `FRONTEND_URL` and `ADMIN_URL` so email links point to production domains.

### Option B — AWS

| Component | Service |
|---|---|
| Backend | ECS Fargate (Docker) behind ALB |
| MySQL | RDS MySQL 8 (Multi-AZ for prod) |
| Storefront / Admin | ECS Fargate or AWS Amplify |
| Storage | Cloudflare R2 or S3 + CloudFront |
| Secrets | AWS Secrets Manager injected as ECS env |

```bash
# Build and push images to ECR
aws ecr get-login-password --region <region> \
  | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

docker build -t ecommerce-backend ./backend
docker tag  ecommerce-backend:latest <ecr-uri>/ecommerce-backend:latest
docker push <ecr-uri>/ecommerce-backend:latest

# Repeat for storefront and admin
```

Create ECS task definitions pointing at the ECR images; inject secrets from AWS Secrets Manager via `valueFrom`.

## Environment Variables

See [`.env.example`](.env.example) for every variable with inline documentation.

| Group | Key Variables |
|---|---|
| Database | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` |
| JWT | `JWT_SECRET`, `JWT_ACCESS_EXPIRY_MS`, `JWT_REFRESH_EXPIRY_MS` |
| Storage | `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_PUBLIC_URL` |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` |
| Shipping | `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` |
| URLs | `FRONTEND_URL`, `ADMIN_URL`, `CORS_ALLOWED_ORIGINS` |
| Next.js public | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` |

## Database Migrations

Schema is managed by Flyway. Migration files live in `database/migrations/` and are also on the backend classpath.

```bash
# Run standalone (requires flyway.conf)
cd database && flyway migrate

# Check applied versions
flyway info
```

Never edit a migration file that has already been applied. Always add a new `V{n}__description.sql`.

## API Documentation

Swagger UI is served at `/swagger-ui.html`. The machine-readable OpenAPI spec is at `/api-docs`.

## Contributing / Forking

See [`FORKING_GUIDE.md`](FORKING_GUIDE.md) for a step-by-step guide on adapting this boilerplate for a specific client.
