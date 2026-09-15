const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', portfolioController.getAll);
router.get('/:id', portfolioController.getById);

router.post('/', requireAuth, portfolioController.create);
router.put('/:id', requireAuth, portfolioController.update);
router.delete('/:id', requireAuth, portfolioController.delete);

module.exports = router;
