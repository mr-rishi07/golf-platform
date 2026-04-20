//Correct the name of user to User

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive'
  },
  charitySelected: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    default: null
  },
  charityPercentage: {
    type: Number,
    default: 10,
    min: 10,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);