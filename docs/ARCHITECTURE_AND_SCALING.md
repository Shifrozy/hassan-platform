# Hassan Platform - Technical Architecture & Phased Scaling Roadmap

This document outlines the **multi-phase architectural scaling plan** for transforming **Hassan Platform** from the initial Version 1 foundation into a complete, full-featured digital trading software and quantitative business platform.

---

## 1. System Overview & Clean Separation

Version 1 is intentionally built with a **decoupled data and presentation layer**:

```text
┌───────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (UI)                    │
│      HTML5 + Vanilla CSS Modern Design System + ES6 JS        │
└──────────────────────────────┬────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│       PHASE 1 (V1)      │           │     PHASES 2-7 (SCALED) │
│ Static JS Data Stores   │  ──────>  │ REST / GraphQL APIs     │
│ (assets/js/data/*.js)   │           │ (Node.js/Python/Supabase)│
└─────────────────────────┘           └───────────┬─────────────┘
                                                  │
                                                  ▼
                                      ┌─────────────────────────┐
                                      │ PostgreSQL / MongoDB DB │
                                      │ Stripe & Crypto Checkout│
                                      │ MT5 WebRequest License  │
                                      └─────────────────────────┘
```

Because all products, services, portfolio case studies, and reviews are structured as clean JSON-compatible data objects, upgrading the frontend to fetch from an API requires changing only the data loading functions.

---

## 2. Phased Scaling Roadmap

### Phase 1: High-Converting Foundation (Current Release)
- [x] Complete 7-page responsive website (Home, About, Services, Products, Portfolio, Reviews, Contact)
- [x] Modern quantitative fintech visual design system (Obsidian dark theme, electric cyan/profit green accents)
- [x] Interactive Strategy ROI / Backtest Expectancy Calculator
- [x] Product detail drawer & request flow
- [x] Portfolio category filtering & case study inspector
- [x] Verified client reviews showcase
- [x] Client-side contact validation with honeypot anti-spam protection
- [x] SEO Optimization (Schema.org JSON-LD, sitemap.xml, robots.txt, OpenGraph)
- [x] Hostinger deployment & custom domain connection documentation

---

### Phase 2: Content Management & Database Backend
* **Goal:** Enable managing products, case studies, reviews, and client inquiries from a private admin panel without touching code.
* **Recommended Stack:**
  * **Option A (Lightweight Full-Stack):** Node.js / Express or Python / FastAPI with SQLite/PostgreSQL.
  * **Option B (Serverless Headless CMS):** Supabase (PostgreSQL + Built-in Auth + Realtime + Storage).
* **Key Features:**
  * Admin authentication (JWT / Session-based with 2FA).
  * CRUD APIs for Products, Portfolio, Services, and Reviews.
  * Contact inquiry inbox and email notifications (SendGrid / Postmark / Resend).

---

### Phase 3: Customer Accounts & Portal
* **Goal:** Allow customers to log in, view their purchased products, license keys, and order history.
* **Key Features:**
  * Customer Registration & Login (Email/Password + Google OAuth).
  * Password Reset & Email Verification.
  * Protected Customer Dashboard (`/dashboard`).
  * Profile management and active license key visualizer.

---

### Phase 4: Automated Payment Gateway & Checkout
* **Goal:** Automate instant digital checkout and order generation.
* **Payment Gateways:**
  * **Stripe Checkout:** Cards, Apple Pay, Google Pay, SEPA, iDEAL.
  * **PayPal / Braintree:** Global retail checkout.
  * **Crypto Gateway (Optional):** BTCPayServer / Coinbase Commerce / NOWPayments for USDT/BTC/ETH.
* **Security & Compliance:**
  * Stripe Hosted Checkout (Zero PCI-DSS compliance burden; no credit card numbers ever touch your server).
  * Cryptographically verified Stripe Webhook (`stripe.webhooks.constructEvent()`).
  * Automated order generation & PDF invoice delivery via email.

---

### Phase 5: Automated EA & Software Licensing System
* **Goal:** Issue unique license keys for MetaTrader 4/5 Expert Advisors and Python bots that verify activation on MT5 terminals via `WebRequest()`.
* **How MQL5 EA Licensing Works:**
  1. Customer purchases product &rarr; System generates unique UUID key (e.g., `HP-MT5-9482-XAU-A81F`).
  2. Customer inputs their license key and Account Number into the EA inputs inside MT5.
  3. Inside MQL5 `OnInit()`:
     ```mql5
     string serverUrl = "https://api.hassanplatform.com/v1/license/verify";
     string payload = "{\"key\":\"" + InpLicenseKey + "\",\"account\":\"" + IntegerToString(AccountNumber()) + "\"}";
     char postData[], resultData[];
     StringToCharArray(payload, postData);
     
     int res = WebRequest("POST", serverUrl, "Content-Type: application/json\r\n", 5000, postData, resultData, headers);
     if (res != 200) {
        Print("CRITICAL: License validation failed or expired. EA disabled.");
        ExpertRemove();
     }
     ```
  4. Backend verifies key status, expiration date, allowed MT5 account IDs, and responds with cryptographic authorization token.

---

### Phase 6: Subscriptions & Recurring Memberships
* **Goal:** Sell proprietary indicators and trading algorithms on monthly/yearly recurring plans.
* **Key Features:**
  * Stripe Billing / Customer Portal integration.
  * Automatic license deactivation on payment failure or cancellation.
  * Tiered plans (e.g. Standard 1-Account, Pro 3-Accounts, Fund Unlimited).

---

### Phase 7: Advanced Enterprise Dashboard & Telemetry
* **Goal:** Institutional analytics and live execution telemetry.
* **Key Features:**
  * Real-time Revenue & ARR/MRR analytics.
  * Active EA Instances Telemetry (monitoring how many client EAs are executing live globally).
  * Automated license revocation controls.
  * Affiliate / Referral tracking system for partner traders.

---

## 3. Database Schema Blueprint (PostgreSQL / Supabase)

```sql
-- 1. Users Table (Admin & Customers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'customer', -- 'admin', 'customer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    platform VARCHAR(100), -- 'MT5', 'MT4', 'Python', 'IBKR'
    version VARCHAR(50),
    price_cents INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id VARCHAR(100) REFERENCES products(id),
    stripe_session_id VARCHAR(255) UNIQUE,
    amount_paid_cents INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'usd',
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Licenses Table (For MT4/MT5 Verification)
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    product_id VARCHAR(100) REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    max_accounts INT DEFAULT 1,
    allowed_account_numbers TEXT[], -- Array of allowed MT4/MT5 account IDs
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime licenses
    last_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Development Summary

With this structured foundation in place, you can comfortably launch **Version 1** online today, begin showcasing your work and capturing client inquiries immediately, and scale into full e-commerce and automated licensing as your trading business expands.
