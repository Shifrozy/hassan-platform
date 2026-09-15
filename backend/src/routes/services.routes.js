const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', servicesController.getAll);
router.get('/:id', servicesController.getById);

router.post('/', requireAuth, servicesController.create);
router.put('/:id', requireAuth, servicesController.update);
router.delete('/:id', requireAuth, servicesController.delete);

module.exports = router;
