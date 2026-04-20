const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true // e.g. "2026-04"
  },
  status: {
    type: String,
    enum: ['pending', 'simulated', 'published'],
    default: 'pending'
  },
  drawType: {
    type: String,
    enum: ['random', 'algorithmic'],
    default: 'random'
  },
  winningNumbers: {
    type: [Number], // 5 numbers
    default: []
  },
  totalPrizePool: {
    type: Number,
    default: 0
  },
  jackpotAmount: {
    type: Number,
    default: 0
  },
  fourMatchAmount: {
    type: Number,
    default: 0
  },
  threeMatchAmount: {
    type: Number,
    default: 0
  },
  jackpotRolledOver: {
    type: Boolean,
    default: false
  },
  previousJackpot: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);