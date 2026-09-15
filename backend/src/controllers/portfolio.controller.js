const { query } = require('../config/database');

function formatPortfolio(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    name: row.title, // alias for admin panel
    category: row.category || 'MetaTrader',
    categoryLabel: row.category_label || row.category || 'Case Study',
    clientType: row.client_type || 'Confidential Client',
    client: row.client_type || 'Confidential Client', // alias
    image: row.image || 'assets/images/portfolio/project-mt5-ea.svg',
    description: row.description || '',
    metrics: Array.isArray(row.metrics) ? row.metrics : (typeof row.metrics === 'string' ? JSON.parse(row.metrics || '[]') : []),
    technologies: Array.isArray(row.technologies) ? row.technologies : (typeof row.technologies === 'string' ? JSON.parse(row.technologies || '[]') : []),
    features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features || '[]') : []),
    status: row.status || 'Active on Live Account',
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
      ? 'SELECT * FROM portfolio ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM portfolio WHERE is_active = true ORDER BY display_order ASC, created_at DESC';

    const result = await query(sql);
    const items = result.rows.map(formatPortfolio);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM portfolio WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Portfolio item '${id}' not found` });
    }

    res.json({
      success: true,
      data: formatPortfolio(result.rows[0])
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
      return res.status(400).json({ success: false, message: 'Portfolio title/name is required' });
    }

    const id = (body.id || title).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    let metrics = body.metrics;
    if (!metrics && (body.metricLabel || body.metricValue)) {
      metrics = [{ label: body.metricLabel || 'Result', value: body.metricValue || '100%' }];
    }
    const metricsJson = JSON.stringify(Array.isArray(metrics) ? metrics : []);
    const technologies = JSON.stringify(Array.isArray(body.technologies) ? body.technologies : []);
    const features = JSON.stringify(Array.isArray(body.features) ? body.features : []);

    const sql = `
      INSERT INTO portfolio (
        id, title, category, category_label, client_type, image, description,
        metrics, technologies, features, status, display_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      id, title, body.category || 'MetaTrader', body.categoryLabel || body.category || 'MT5 EA',
      body.clientType || body.client || 'Confidential Client', body.image || '',
      body.description || '', metricsJson, technologies, features,
      body.status || 'Active on Live Account', parseInt(body.displayOrder, 10) || 0,
      body.isActive !== false
    ];

    const result = await query(sql, values);
    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      data: formatPortfolio(result.rows[0])
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Portfolio item with this ID already exists' });
    }
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM portfolio WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Portfolio item '${id}' not found` });
    }
    const current = existing.rows[0];

    const title = body.title !== undefined ? body.title : (body.name !== undefined ? body.name : current.title);
    const category = body.category !== undefined ? body.category : current.category;
    const categoryLabel = body.categoryLabel !== undefined ? body.categoryLabel : current.category_label;
    const clientType = body.clientType !== undefined ? body.clientType : (body.client !== undefined ? body.client : current.client_type);
    const image = body.image !== undefined ? body.image : current.image;
    const description = body.description !== undefined ? body.description : current.description;

    let metricsJson = current.metrics;
    if (body.metrics !== undefined) {
      metricsJson = JSON.stringify(Array.isArray(body.metrics) ? body.metrics : []);
    } else if (body.metricLabel || body.metricValue) {
      metricsJson = JSON.stringify([{ label: body.metricLabel || 'Result', value: body.metricValue || '100%' }]);
    }

    const technologies = body.technologies !== undefined ? JSON.stringify(Array.isArray(body.technologies) ? body.technologies : []) : current.technologies;
    const features = body.features !== undefined ? JSON.stringify(Array.isArray(body.features) ? body.features : []) : current.features;
    const status = body.status !== undefined ? body.status : current.status;
    const displayOrder = body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : current.display_order;
    const isActive = body.isActive !== undefined ? body.isActive : current.is_active;

    const sql = `
      UPDATE portfolio SET
        title = $1, category = $2, category_label = $3, client_type = $4, image = $5,
        description = $6, metrics = $7, technologies = $8, features = $9, status = $10,
        display_order = $11, is_active = $12, updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;

    const values = [
      title, category, categoryLabel, clientType, image, description,
      metricsJson, technologies, features, status, displayOrder, isActive, id
    ];

    const result = await query(sql, values);
    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: formatPortfolio(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM portfolio WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Portfolio item '${id}' not found` });
    }

    res.json({
      success: true,
      message: `Portfolio item '${id}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
