const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// GET /api/reviews/:productId
router.get('/:productId', reviewController.getReviewsByProduct);

// POST /api/reviews
router.post('/', reviewController.addReview);

module.exports = router;
