const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:userId', authMiddleware, wishlistController.getWishlist);
router.post('/toggle', authMiddleware, wishlistController.toggleWishlist);

module.exports = router;
