const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', configController.get);
router.put('/', requireAuth, configController.update);

module.exports = router;
