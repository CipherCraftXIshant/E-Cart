const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/reviews/:productId
router.get('/:productId', reviewController.getReviewsByProduct);

// POST /api/reviews
router.post('/', authMiddleware, reviewController.addReview);

module.exports = router;
