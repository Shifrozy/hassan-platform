const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/algenza_db',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_994821',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@algenza.com',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || 'Hassan@2026',
  adminName: process.env.ADMIN_NAME || 'M. Hassan',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['https://algenza.com', 'https://hassan-platform.pages.dev', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:5000']
};

module.exports = env;
