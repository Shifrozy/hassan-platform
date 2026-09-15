const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { requireAuth } = require('../middleware/auth');

// Public endpoints
router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

// Protected admin CRUD endpoints
router.post('/', requireAuth, productsController.create);
router.put('/:id', requireAuth, productsController.update);
router.delete('/:id', requireAuth, productsController.delete);

module.exports = router;
