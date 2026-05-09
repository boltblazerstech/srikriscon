# Forking Guide — Adapting the Boilerplate for a Client

This guide explains exactly what to change for each new client project and what to leave untouched.

---

## Step 1 — Clone

```bash
git clone https://github.com/your-org/ecommerce-boilerplate.git my-client-store
cd my-client-store

# Detach from the template remote, add your own
git remote remove origin
git remote add origin https://github.com/your-org/my-client-store.git
git push -u origin main
```

---

## Step 2 — Update the Visual Theme

All design tokens live in **one file per app**. You only need to edit two files:

### Storefront — `storefront/src/styles/theme.ts` (or `globals.css`)

```ts
export const theme = {
  colors: {
    primary: "#4f46e5", // ← change to client brand colour
    secondary: "#7c3aed",
  },
  fonts: {
    heading: "Inter", // ← swap for client's Google Font
    body: "Inter",
  },
  storeName: "Sri Kriscon", // ← appears in nav, footer, meta tags
};
```

Also update `storefront/app/layout.tsx`:

- `<title>` / `metadata.title`
- `metadata.description`
- Favicon path in `<head>` or Next.js `icons` config

### Admin panel

Admin uses neutral colours and rarely needs reskinning. If the client wants branded admin colours, update the CSS variables in `admin/app/globals.css`:

```css
:root {
  --color-primary: #4f46e5; /* ← client accent */
}
```

---

## Step 3 — Fill in `.env`

```bash
cp .env.example .env
```

Work through each section in order:

| Section        | What to get                                                    |
| -------------- | -------------------------------------------------------------- |
| **Database**   | Create MySQL DB (local or Aiven); copy credentials             |
| **JWT**        | Run `openssl rand -base64 64`; paste as `JWT_SECRET`           |
| **R2**         | Cloudflare dashboard → R2 → create bucket → API tokens         |
| **Razorpay**   | Razorpay dashboard → Settings → API Keys                       |
| **Shiprocket** | Shiprocket account email + password                            |
| **SMTP**       | Gmail App Password or transactional email provider             |
| **URLs**       | Set to `http://localhost:3000` etc. for local; update for prod |

---

## Step 4 — Run Database Migrations

```bash
cd backend
mvn spring-boot:run   # Flyway runs automatically
```

Or with Flyway CLI:

```bash
cd database
# Edit flyway.conf with your DB credentials first
flyway migrate
```

This creates all tables and seeds the default super admin (`admin` / `Admin@123`).

---

## Step 5 — First Admin Login

1. Open `http://localhost:3001`
2. Log in with `admin` / `Admin@123`
3. Go to **Users** and change the password (or create a new SUPER_ADMIN and delete the default)

---

## Step 6 — Populate Content via Admin Panel

Work through each section to set up the store before launch:

| Admin section               | What to do                                                   |
| --------------------------- | ------------------------------------------------------------ |
| **Settings → General**      | Store name, tagline, logo, favicon, currency, shipping rates |
| **Settings → Contact**      | Phone, WhatsApp, email, physical address, GST number         |
| **Settings → Social**       | Facebook, Instagram, YouTube URLs                            |
| **Settings → Integrations** | Paste Razorpay public key, Google Analytics ID               |
| **Categories**              | Create product categories (slug auto-generates)              |
| **Products**                | Add products with images, variants, pricing, SEO             |
| **Banners**                 | Upload hero banners with CTA links; drag to reorder          |
| **Gallery**                 | Upload brand/lifestyle images                                |
| **Testimonials**            | Add customer reviews (can fake initial ones)                 |
| **CMS Pages**               | Edit About, Privacy Policy, Terms, Shipping Policy content   |

---

## Step 7 — Deploy

Follow the deployment guide in [`README.md`](README.md#deployment).

For Option A (Render + Vercel + Aiven):

1. Push code to GitHub
2. Create Aiven MySQL, Render backend service, two Vercel projects
3. Set all env vars in each platform's dashboard
4. Redeploy — Flyway will migrate the production database on first boot

---

## What Changes Per Client vs What Never Changes

### Always change

| What                    | Where                                             |
| ----------------------- | ------------------------------------------------- |
| Brand colours           | `storefront/src/styles/theme.ts` or CSS variables |
| Store name / tagline    | `theme.ts`, `layout.tsx` metadata                 |
| Logo and favicon        | Upload via admin panel after deploy               |
| All `.env` values       | Copy `.env.example`, fill every field             |
| Admin password          | First login via Users page                        |
| Categories and products | Admin panel                                       |
| Banner images           | Admin panel                                       |
| CMS page content        | Admin panel → Pages                               |
| Social links            | Admin panel → Settings → Social                   |
| Domain / URLs           | `.env` + DNS + OAuth redirect lists               |

### Never change (shared infrastructure)

| What                               | Reason                                               |
| ---------------------------------- | ---------------------------------------------------- |
| Database schema / migrations       | Schema is additive — never edit applied migrations   |
| API contracts                      | Storefront and admin depend on fixed endpoint shapes |
| Auth flow (JWT)                    | Changing this breaks all sessions                    |
| Flyway migration filenames         | Flyway checksums will fail if filenames change       |
| `V1__create_initial_schema.sql`    | Deleting or editing breaks every environment         |
| Docker multi-stage build structure | Works as-is; only change env vars                    |

### Safe to extend (add, don't remove)

- New Flyway migrations (`V3__add_reviews_table.sql`, etc.)
- New API endpoints in the backend
- New pages in storefront or admin
- Additional Tailwind utility classes
- New product fields (via migration + API + UI)

---

## Checklist Before Going Live

- [ ] `.env` fully filled — no placeholder values remain
- [ ] `JWT_SECRET` is a strong random value (not the example)
- [ ] Default admin password changed
- [ ] `CORS_ALLOWED_ORIGINS` set to production URLs only
- [ ] `FRONTEND_URL` and `ADMIN_URL` set to production domains
- [ ] Razorpay webhook configured to point at `https://api.yourdomain.com/api/payments/webhook`
- [ ] R2 bucket CORS policy allows requests from storefront domain
- [ ] Logo, favicon, and banner images uploaded
- [ ] At least one category and product created
- [ ] CMS pages reviewed (Privacy Policy, Terms, Shipping Policy)
- [ ] Test a complete order flow (place → pay → ship)
- [ ] SSL certificates in place on all three domains
- [ ] `LOG_SQL=OFF` in production env
