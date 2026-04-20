const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addScore, getScores, updateScore, deleteScore } = require('../controllers/scoreController');

router.use(authMiddleware); // Sabhi routes protected hain

router.post('/', addScore);
router.get('/', getScores);
router.put('/:id', updateScore);
router.delete('/:id', deleteScore);

module.exports = router;