const { Pool } = require('pg');
const env = require('./env');

const isProduction = env.nodeEnv === 'production';

// Render and hosted cloud PostgreSQL databases often require SSL
const poolConfig = {
  connectionString: env.databaseUrl
};

if (isProduction || (env.databaseUrl && env.databaseUrl.includes('render.com'))) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
