const express = require('express');
const router = express.Router();
const { startFlashSale, endFlashSale } = require('../controllers/flash.controller');

// POST /api/flash/start  — Trigger a flash sale for all users
router.post('/start', startFlashSale);

// POST /api/flash/end  — End a flash sale early
router.post('/end', endFlashSale);

module.exports = router;
