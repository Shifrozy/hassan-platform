const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getById);

router.post('/', requireAuth, reviewsController.create);
router.put('/:id', requireAuth, reviewsController.update);
router.delete('/:id', requireAuth, reviewsController.delete);

module.exports = router;
