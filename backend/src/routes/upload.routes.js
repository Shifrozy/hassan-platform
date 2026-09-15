const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, upload.single('image'), uploadController.uploadFile);

module.exports = router;
