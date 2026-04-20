const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  getUser,
  deleteUser,
  getAllWinners,
  verifyWinner,
  markPaid,
  getAnalytics
} = require('../controllers/adminController');

// Sabhi admin routes protected hain
router.use(authMiddleware, adminMiddleware);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);

// Winners
router.get('/winners', getAllWinners);
router.put('/winners/:id/verify', verifyWinner);
router.put('/winners/:id/paid', markPaid);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;