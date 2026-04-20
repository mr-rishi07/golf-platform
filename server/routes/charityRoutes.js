const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity
} = require('../controllers/charityController');

// Public routes
router.get('/', getCharities);
router.get('/:id', getCharity);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createCharity);
router.put('/:id', authMiddleware, adminMiddleware, updateCharity);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCharity);

module.exports = router;