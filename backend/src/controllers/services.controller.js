const { query } = require('../config/database');

function formatService(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    name: row.title, // alias for admin panel compatibility
    category: row.category || 'MetaTrader',
    icon: row.icon || 'terminal',
    shortDesc: row.short_desc || '',
    detailedDesc: row.detailed_desc || '',
    technologies: Array.isArray(row.technologies) ? row.technologies : (typeof row.technologies === 'string' ? JSON.parse(row.technologies || '[]') : []),
    benefits: Array.isArray(row.benefits) ? row.benefits : (typeof row.benefits === 'string' ? JSON.parse(row.benefits || '[]') : []),
    badge: row.badge || '',
    ctaText: row.cta_text || 'Request Quote',
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
      ? 'SELECT * FROM services ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM services WHERE is_active = true ORDER BY display_order ASC, created_at DESC';

    const result = await query(sql);
    const services = result.rows.map(formatService);

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM services WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Service '${id}' not found` });
    }

    res.json({
      success: true,
      data: formatService(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body;
    const title = body.title || body.name;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Service title/name is required' });
    }

    const id = (body.id || title).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const technologies = JSON.stringify(Array.isArray(body.technologies) ? body.technologies : (typeof body.technologies === 'string' ? body.technologies.split(',').map(s => s.trim()) : []));
    const benefits = JSON.stringify(Array.isArray(body.benefits) ? body.benefits : (Array.isArray(body.features) ? body.features : []));

    const sql = `
      INSERT INTO services (
        id, title, category, icon, short_desc, detailed_desc, technologies,
        benefits, badge, cta_text, display_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      id, title, body.category || 'MetaTrader', body.icon || 'terminal',
      body.shortDesc || body.description || '', body.detailedDesc || body.description || '',
      technologies, benefits, body.badge || '', body.ctaText || 'Request Quote',
      parseInt(body.displayOrder, 10) || 0, body.isActive !== false
    ];

    const result = await query(sql, values);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: formatService(result.rows[0])
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Service with this ID already exists' });
    }
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM services WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Service '${id}' not found` });
    }
    const current = existing.rows[0];

    const title = body.title !== undefined ? body.title : (body.name !== undefined ? body.name : current.title);
    const category = body.category !== undefined ? body.category : current.category;
    const icon = body.icon !== undefined ? body.icon : current.icon;
    const shortDesc = body.shortDesc !== undefined ? body.shortDesc : (body.description !== undefined ? body.description : current.short_desc);
    const detailedDesc = body.detailedDesc !== undefined ? body.detailedDesc : (body.description !== undefined ? body.description : current.detailed_desc);
    const technologies = body.technologies !== undefined ? JSON.stringify(Array.isArray(body.technologies) ? body.technologies : []) : current.technologies;
    const benefits = body.benefits !== undefined ? JSON.stringify(Array.isArray(body.benefits) ? body.benefits : []) : (body.features !== undefined ? JSON.stringify(Array.isArray(body.features) ? body.features : []) : current.benefits);
    const badge = body.badge !== undefined ? body.badge : current.badge;
    const ctaText = body.ctaText !== undefined ? body.ctaText : current.cta_text;
    const displayOrder = body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : current.display_order;
    const isActive = body.isActive !== undefined ? body.isActive : current.is_active;

    const sql = `
      UPDATE services SET
        title = $1, category = $2, icon = $3, short_desc = $4, detailed_desc = $5,
        technologies = $6, benefits = $7, badge = $8, cta_text = $9,
        display_order = $10, is_active = $11, updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      title, category, icon, shortDesc, detailedDesc, technologies,
      benefits, badge, ctaText, displayOrder, isActive, id
    ];

    const result = await query(sql, values);
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: formatService(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Service '${id}' not found` });
    }

    res.json({
      success: true,
      message: `Service '${id}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
