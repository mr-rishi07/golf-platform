const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const { simulateDraw, publishDraw, getDraws, getMyWinnings } = require('../controllers/drawController');

// Public
router.get('/', getDraws);

// User
router.get('/my-winnings', authMiddleware, getMyWinnings);

// Admin only
router.post('/simulate', authMiddleware, adminMiddleware, simulateDraw);
router.put('/publish/:drawId', authMiddleware, adminMiddleware, publishDraw);

module.exports = router;