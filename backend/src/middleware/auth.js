const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { query } = require('../config/database');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Token is empty.'
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    
    // Verify admin still exists in database
    const result = await query('SELECT id, email, full_name FROM admins WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or session revoked.'
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
}

module.exports = { requireAuth };
