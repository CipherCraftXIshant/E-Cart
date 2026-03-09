const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/:userId', authMiddleware, orderController.getOrdersByUser);
router.get('/', orderController.getAllOrders); // Optional: view all orders

module.exports = router;
