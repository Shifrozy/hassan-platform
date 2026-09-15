const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const PORT = env.port;

const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Algenza Backend Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${env.nodeEnv}`);
  console.log(`📍 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);

  // Test PostgreSQL connection
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('⚠️ PostgreSQL connection failed on startup:', err.message);
    console.log('ℹ️ Ensure DATABASE_URL is configured correctly in .env or Render dashboard.');
  }
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await pool.end();
      console.log('PostgreSQL pool closed.');
    } catch (e) {
      console.error('Error closing pool:', e);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
