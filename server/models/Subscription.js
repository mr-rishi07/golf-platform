const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive'
  },
  amount: {
    type: Number,
    required: true
  },
  charityPercentage: {
    type: Number,
    default: 10,
    min: 10,
    max: 100
  },
  prizePoolContribution: {
    type: Number,
    default: 0
  },
  charityContribution: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  renewalDate: {
    type: Date
  },
  stripeCustomerId: {
    type: String,
    default: ''
  },
  stripeSubscriptionId: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);