const { query } = require('../config/database');

exports.get = async (req, res, next) => {
  try {
    const result = await query("SELECT config_data, updated_at FROM site_config WHERE id = 'default'");
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {}
      });
    }

    const data = result.rows[0].config_data;
    res.json({
      success: true,
      data: typeof data === 'string' ? JSON.parse(data) : data,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid configuration payload' });
    }

    // Merge with existing config
    const existing = await query("SELECT config_data FROM site_config WHERE id = 'default'");
    let merged = newConfig;

    if (existing.rows.length > 0) {
      const current = typeof existing.rows[0].config_data === 'string'
        ? JSON.parse(existing.rows[0].config_data)
        : existing.rows[0].config_data;
      merged = { ...current, ...newConfig };
    }

    const result = await query(
      `INSERT INTO site_config (id, config_data, updated_at)
       VALUES ('default', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET
         config_data = EXCLUDED.config_data,
         updated_at = NOW()
       RETURNING config_data, updated_at`,
      [JSON.stringify(merged)]
    );

    const data = result.rows[0].config_data;
    res.json({
      success: true,
      message: 'Site configuration updated successfully',
      data: typeof data === 'string' ? JSON.parse(data) : data,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    next(error);
  }
};
