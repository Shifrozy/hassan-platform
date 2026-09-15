const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

router.get('/', async (req, res) => {
  let dbStatus = 'ok';
  try {
    await query('SELECT 1');
  } catch (err) {
    dbStatus = 'unreachable';
  }

  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    service: 'Algenza Backend API'
  });
});

module.exports = router;
