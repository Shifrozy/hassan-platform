const { query } = require('../config/database');

function formatReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    clientName: row.client_name,
    name: row.client_name, // alias for admin panel
    country: row.country || '',
    countryCode: row.country_code || '',
    location: row.country || '', // alias
    role: row.role || 'Trader',
    serviceUsed: row.service_used || 'Custom Development',
    projectType: row.service_used || 'Custom Development', // alias
    rating: parseInt(row.rating, 10) || 5,
    date: row.date || 'Recent',
    avatar: row.avatar || (row.client_name ? row.client_name.slice(0, 2).toUpperCase() : 'CL'),
    comment: row.comment || '',
    quote: row.comment || '', // alias
    verified: row.verified !== false,
    displayOrder: row.display_order || 0,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const includeInactive = req.query.all === 'true';
    const sql = includeInactive
      ? 'SELECT * FROM reviews ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM reviews WHERE is_active = true ORDER BY display_order ASC, created_at DESC';

    const result = await query(sql);
    const reviews = result.rows.map(formatReview);

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM reviews WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Review '${id}' not found` });
    }

    res.json({
      success: true,
      data: formatReview(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body;
    const clientName = body.clientName || body.name || body.author;
    if (!clientName) {
      return res.status(400).json({ success: false, message: 'Client name is required' });
    }

    const comment = body.comment || body.quote || body.text;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Review text/comment is required' });
    }

    const id = body.id || `rev-${Date.now().toString(36)}`;
    const avatar = body.avatar || clientName.slice(0, 2).toUpperCase();

    const sql = `
      INSERT INTO reviews (
        id, client_name, country, country_code, role, service_used,
        rating, date, avatar, comment, verified, display_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      id, clientName, body.country || body.location || '', body.countryCode || '',
      body.role || 'Trader', body.serviceUsed || body.projectType || 'Custom EA Development',
      parseInt(body.rating, 10) || 5, body.date || 'Recent', avatar, comment,
      body.verified !== false, parseInt(body.displayOrder, 10) || 0, body.isActive !== false
    ];

    const result = await query(sql, values);
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: formatReview(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM reviews WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Review '${id}' not found` });
    }
    const current = existing.rows[0];

    const clientName = body.clientName !== undefined ? body.clientName : (body.name !== undefined ? body.name : current.client_name);
    const country = body.country !== undefined ? body.country : (body.location !== undefined ? body.location : current.country);
    const countryCode = body.countryCode !== undefined ? body.countryCode : current.country_code;
    const role = body.role !== undefined ? body.role : current.role;
    const serviceUsed = body.serviceUsed !== undefined ? body.serviceUsed : (body.projectType !== undefined ? body.projectType : current.service_used);
    const rating = body.rating !== undefined ? parseInt(body.rating, 10) : current.rating;
    const date = body.date !== undefined ? body.date : current.date;
    const avatar = body.avatar !== undefined ? body.avatar : current.avatar;
    const comment = body.comment !== undefined ? body.comment : (body.quote !== undefined ? body.quote : current.comment);
    const verified = body.verified !== undefined ? body.verified : current.verified;
    const displayOrder = body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : current.display_order;
    const isActive = body.isActive !== undefined ? body.isActive : current.is_active;

    const sql = `
      UPDATE reviews SET
        client_name = $1, country = $2, country_code = $3, role = $4,
        service_used = $5, rating = $6, date = $7, avatar = $8, comment = $9,
        verified = $10, display_order = $11, is_active = $12, updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;

    const values = [
      clientName, country, countryCode, role, serviceUsed, rating, date,
      avatar, comment, verified, displayOrder, isActive, id
    ];

    const result = await query(sql, values);
    res.json({
      success: true,
      message: 'Review updated successfully',
      data: formatReview(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Review '${id}' not found` });
    }

    res.json({
      success: true,
      message: `Review '${id}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
