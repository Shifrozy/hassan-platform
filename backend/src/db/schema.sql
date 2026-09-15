-- ==============================================================================
-- Algenza Production Database Schema (PostgreSQL)
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admins / Users Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50),
  tagline TEXT,
  platform VARCHAR(100),
  platform_badge VARCHAR(50),
  category VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  price_formatted VARCHAR(50),
  billing_type VARCHAR(100) DEFAULT 'One-Time License',
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INT DEFAULT 0,
  image TEXT,
  badge VARCHAR(100),
  short_desc TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  supported_pairs JSONB DEFAULT '[]'::jsonb,
  min_deposit VARCHAR(100),
  recommended_timeframe VARCHAR(100),
  changelog JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  icon VARCHAR(50),
  short_desc TEXT,
  detailed_desc TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  badge VARCHAR(100),
  cta_text VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 4. Portfolio / Case Studies Table
CREATE TABLE IF NOT EXISTS portfolio (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  category_label VARCHAR(100),
  client_type VARCHAR(150),
  image TEXT,
  description TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_active ON portfolio(is_active);

-- 5. Reviews / Testimonials Table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(100) PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  country VARCHAR(100),
  country_code VARCHAR(10),
  role VARCHAR(150),
  service_used VARCHAR(150),
  rating INT NOT NULL DEFAULT 5,
  date VARCHAR(50),
  avatar VARCHAR(10),
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);

-- 6. Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  config_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
