# Render Deployment & PostgreSQL Setup Guide

This guide walks you through deploying the **Algenza Node.js Backend & PostgreSQL Database** on [Render.com](https://render.com) and linking it to your Cloudflare Pages frontend ([algenza.com](https://algenza.com)).

---

## 1. Create PostgreSQL Database on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** &rarr; **PostgreSQL**.
3. Configure the database settings:
   - **Name**: `algenza-db`
   - **Database**: `algenza_db`
   - **User**: `algenza_user`
   - **Region**: Choose the region closest to you (e.g., `Frankfurt (EU Central)` or `Oregon (US West)`).
   - **Plan**: **Free** (or Starter for high uptime).
4. Click **Create Database**.
5. Once provisioned, locate the **Connections** section:
   - Copy the **Internal Database URL** (if deploying backend on Render in the same region) OR the **External Database URL**.
   - Example: `postgresql://algenza_user:password@dpg-xxxxxxxx-a.oregon-postgres.render.com/algenza_db`

---

## 2. Create the Backend Web Service on Render

1. On the Render Dashboard, click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository: **`Shifrozy/hassan-platform`**.
3. Configure the Web Service:
   - **Name**: `algenza-backend` (or your preferred name)
   - **Region**: Same region as your database
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Crucial: set to `backend`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (or Starter)

---

## 3. Configure Environment Variables on Render

In your Render Web Service settings, go to the **Environment** tab and add the following variables:

| Key | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Production mode |
| `DATABASE_URL` | *(Paste Render PostgreSQL URL)* | Database connection string with SSL |
| `JWT_SECRET` | *(Random 32+ char string)* | Secure key to sign admin authentication tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `ADMIN_EMAIL` | `admin@algenza.com` | Initial admin account email |
| `ADMIN_INITIAL_PASSWORD` | `Hassan@2026` | Initial admin account password |
| `ADMIN_NAME` | `M. Hassan` | Admin display name |
| `ALLOWED_ORIGINS` | `https://algenza.com,https://hassan-platform.pages.dev` | Allowed CORS origins for browser security |

Click **Save Changes**. Render will trigger an automatic build and start the service.

---

## 4. Initialize Database Tables & Seed Content

Once the Web Service is running:
1. Go to the **Shell** tab of your Render Web Service.
2. Run the database setup script (creates all tables and imports existing products, services, portfolio, reviews, and site branding):
   ```bash
   npm run db:setup
   ```
3. You will see confirmation logs:
   ```
   🚀 Running database migrations...
   ✅ Database tables and indexes created successfully!
   🌱 Starting database seed...
   ✅ Admin user seeded (admin@algenza.com)
   ✅ 5 products seeded.
   ✅ 6 services seeded.
   ✅ 4 portfolio items seeded.
   ✅ 6 reviews seeded.
   ✅ Site configuration seeded.
   🎉 Database seeding completed successfully!
   ```

---

## 5. Verify the Backend API

Render will assign your backend a public URL, for example:
`https://algenza-backend.onrender.com`

Visit the health endpoint in your browser:
`https://algenza-backend.onrender.com/api/health`

It should return:
```json
{
  "status": "ok",
  "database": "ok",
  "timestamp": "...",
  "service": "Algenza Backend API"
}
```

---

## 6. Connect Frontend to Render Backend

Once your backend is live on Render:
1. In `assets/js/config.js`, update `baseUrl` with your Render URL:
   ```javascript
   api: {
     baseUrl: "https://algenza-backend.onrender.com"
   }
   ```
2. Commit and push to GitHub `main`.
3. Cloudflare Pages will rebuild and deploy to **https://algenza.com**.
4. Now, any change made from the Admin Panel on any device saves to PostgreSQL and reflects globally across all devices!

---

## 7. Optional: Setup Custom Domain (`api.algenza.com`)

If you prefer to have the API under your brand domain:
1. In the Render Web Service settings, go to **Custom Domains** &rarr; click **Add Custom Domain**.
2. Enter: `api.algenza.com`.
3. Go to your **Cloudflare Dashboard** (or Namecheap DNS):
   - Add a new **CNAME** record:
     - **Name / Host**: `api`
     - **Target**: `algenza-backend.onrender.com`
     - **Proxy status**: **DNS only (Grey Cloud)** during verification, or Proxied once SSL completes.
4. Update `SITE_CONFIG.api.baseUrl` to `https://api.algenza.com`.
