const { query } = require('../config/database');

function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    version: row.version || '',
    tagline: row.tagline || '',
    platform: row.platform || '',
    platformBadge: row.platform_badge || 'badge-mt5',
    category: row.category || 'Expert Advisor',
    price: parseFloat(row.price) || 0,
    priceFormatted: row.price_formatted || `$${row.price}`,
    billingType: row.billing_type || 'One-Time License',
    rating: parseFloat(row.rating) || 5.0,
    reviewsCount: parseInt(row.reviews_count, 10) || 0,
    image: row.image || 'assets/images/products/apex-scalper.svg',
    badge: row.badge || '',
    shortDesc: row.short_desc || '',
    features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features || '[]') : []),
    supportedPairs: Array.isArray(row.supported_pairs) ? row.supported_pairs : (typeof row.supported_pairs === 'string' ? JSON.parse(row.supported_pairs || '[]') : []),
    minDeposit: row.min_deposit || '',
    recommendedTimeframe: row.recommended_timeframe || '',
    changelog: Array.isArray(row.changelog) ? row.changelog : (typeof row.changelog === 'string' ? JSON.parse(row.changelog || '[]') : []),
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
      ? 'SELECT * FROM products ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM products WHERE is_active = true ORDER BY display_order ASC, created_at DESC';

    const result = await query(sql);
    const products = result.rows.map(formatProduct);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    res.json({
      success: true,
      data: formatProduct(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body;
    const id = (body.id || body.name || Date.now().toString()).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const name = body.name || body.title;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const price = parseFloat(body.price) || 0;
    const priceFormatted = body.priceFormatted || `$${price}`;
    const features = JSON.stringify(Array.isArray(body.features) ? body.features : []);
    const supportedPairs = JSON.stringify(Array.isArray(body.supportedPairs) ? body.supportedPairs : []);
    const changelog = JSON.stringify(Array.isArray(body.changelog) ? body.changelog : []);

    const sql = `
      INSERT INTO products (
        id, name, version, tagline, platform, platform_badge, category, price,
        price_formatted, billing_type, rating, reviews_count, image, badge,
        short_desc, features, supported_pairs, min_deposit, recommended_timeframe,
        changelog, display_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

    const values = [
      id, name, body.version || '', body.tagline || '', body.platform || 'MT5',
      body.platformBadge || 'badge-mt5', body.category || 'Expert Advisor', price,
      priceFormatted, body.billingType || 'One-Time License', parseFloat(body.rating) || 5.0,
      parseInt(body.reviewsCount, 10) || 0, body.image || '', body.badge || '',
      body.shortDesc || body.description || '', features, supportedPairs,
      body.minDeposit || '', body.recommendedTimeframe || '', changelog,
      parseInt(body.displayOrder, 10) || 0, body.isActive !== false
    ];

    const result = await query(sql, values);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatProduct(result.rows[0])
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Product with this ID already exists' });
    }
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Product '${id}' not found` });
    }
    const current = existing.rows[0];

    const name = body.name !== undefined ? body.name : current.name;
    const version = body.version !== undefined ? body.version : current.version;
    const tagline = body.tagline !== undefined ? body.tagline : current.tagline;
    const platform = body.platform !== undefined ? body.platform : current.platform;
    const platformBadge = body.platformBadge !== undefined ? body.platformBadge : current.platform_badge;
    const category = body.category !== undefined ? body.category : current.category;
    const price = body.price !== undefined ? parseFloat(body.price) : parseFloat(current.price);
    const priceFormatted = body.priceFormatted !== undefined ? body.priceFormatted : (body.price !== undefined ? `$${price}` : current.price_formatted);
    const billingType = body.billingType !== undefined ? body.billingType : current.billing_type;
    const rating = body.rating !== undefined ? parseFloat(body.rating) : parseFloat(current.rating);
    const reviewsCount = body.reviewsCount !== undefined ? parseInt(body.reviewsCount, 10) : current.reviews_count;
    const image = body.image !== undefined ? body.image : current.image;
    const badge = body.badge !== undefined ? body.badge : current.badge;
    const shortDesc = body.shortDesc !== undefined ? body.shortDesc : (body.description !== undefined ? body.description : current.short_desc);
    const features = body.features !== undefined ? JSON.stringify(Array.isArray(body.features) ? body.features : []) : current.features;
    const supportedPairs = body.supportedPairs !== undefined ? JSON.stringify(Array.isArray(body.supportedPairs) ? body.supportedPairs : []) : current.supported_pairs;
    const minDeposit = body.minDeposit !== undefined ? body.minDeposit : current.min_deposit;
    const recommendedTimeframe = body.recommendedTimeframe !== undefined ? body.recommendedTimeframe : current.recommended_timeframe;
    const changelog = body.changelog !== undefined ? JSON.stringify(Array.isArray(body.changelog) ? body.changelog : []) : current.changelog;
    const displayOrder = body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : current.display_order;
    const isActive = body.isActive !== undefined ? body.isActive : current.is_active;

    const sql = `
      UPDATE products SET
        name = $1, version = $2, tagline = $3, platform = $4, platform_badge = $5,
        category = $6, price = $7, price_formatted = $8, billing_type = $9, rating = $10,
        reviews_count = $11, image = $12, badge = $13, short_desc = $14, features = $15,
        supported_pairs = $16, min_deposit = $17, recommended_timeframe = $18,
        changelog = $19, display_order = $20, is_active = $21, updated_at = NOW()
      WHERE id = $22
      RETURNING *
    `;

    const values = [
      name, version, tagline, platform, platformBadge, category, price, priceFormatted,
      billingType, rating, reviewsCount, image, badge, shortDesc, features, supportedPairs,
      minDeposit, recommendedTimeframe, changelog, displayOrder, isActive, id
    ];

    const result = await query(sql, values);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: formatProduct(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Product '${id}' not found` });
    }

    res.json({
      success: true,
      message: `Product '${id}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
