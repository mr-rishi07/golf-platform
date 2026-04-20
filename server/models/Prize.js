const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  drawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchType: {
    type: String,
    enum: ['5-match', '4-match', '3-match'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'paid', 'rejected'],
    default: 'pending'
  },
  proofImage: {
    type: String,
    default: ''
  },
  matchedNumbers: {
    type: [Number],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Prize', prizeSchema);