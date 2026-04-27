const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET /api/products
router.get('/', productController.getProducts);

// POST /api/products/seed
router.post('/seed', productController.seedProducts);

module.exports = router;
