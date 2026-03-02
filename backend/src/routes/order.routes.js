const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/:userId', orderController.getOrdersByUser);
router.get('/', orderController.getAllOrders); // Optional: view all orders

module.exports = router;
