const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createSubscription,
  getSubscription,
  cancelSubscription,
  updateCharityPercentage,
  selectCharity
} = require('../controllers/subscriptionController');

router.use(authMiddleware); // Sabhi routes protected

router.post('/', createSubscription);
router.get('/', getSubscription);
router.put('/cancel', cancelSubscription);
router.put('/charity-percentage', updateCharityPercentage);
router.put('/charity', selectCharity);

module.exports = router;