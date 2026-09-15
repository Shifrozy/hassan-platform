# Local Development & Testing Guide

This guide explains how to run and test the **Algenza** full-stack architecture locally on your computer.

---

## 1. Prerequisites

1. **Node.js** (v18 or newer):
   - Download and install from [nodejs.org](https://nodejs.org/).
2. **PostgreSQL**:
   - Option A (Local): Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).
   - Option B (Free Cloud DB): Create a free database on [Render](https://render.com) or [Neon](https://neon.tech) and copy its `DATABASE_URL`.

---

## 2. Setup the Backend

1. Open your terminal in the repository root and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and set your PostgreSQL connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/algenza_db
   JWT_SECRET=super_secret_local_dev_key_2026
   ADMIN_EMAIL=admin@algenza.com
   ADMIN_INITIAL_PASSWORD=Hassan@2026
   ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://localhost:5000
   ```
5. Run the database migration and seed script:
   ```bash
   npm run db:setup
   ```
   *(This creates all tables and seeds the initial admin, products, services, portfolio, reviews, and config).*

6. Start the local backend server:
   ```bash
   npm run dev
   ```
   You will see:
   ```
   ====================================================
   🚀 Algenza Backend Server running on port 5000
   🌐 Environment: development
   📍 Health Endpoint: http://localhost:5000/api/health
   ====================================================
   ✅ PostgreSQL database connected successfully
   ```

---

## 3. Run the Frontend Locally

1. Open a new terminal in the repository root:
   ```bash
   # Run with any static server, e.g. VS Code Live Server (port 5500) or npx serve:
   npx serve . -p 5500
   ```
2. Open your browser to: `http://localhost:5500/admin.html`
3. Notice the top right indicator: **`🟢 API Connected`** (automatically detects `localhost:5000`).

---

## 4. Admin Credentials & Testing CRUD

- **Email**: `admin@algenza.com`
- **Password**: `Hassan@2026`

### Testing Real-time Sync Across Browsers:
1. Log into the admin panel at `http://localhost:5500/admin.html`.
2. Go to **Products** &rarr; click **Add New Product**.
3. Enter product details and click **Save Changes**.
4. Open another browser or an Incognito window to `http://localhost:5500/products.html`.
5. Notice that the new product immediately appears directly from PostgreSQL!
6. Modify or delete any item &rarr; changes are instantly saved to the database.
