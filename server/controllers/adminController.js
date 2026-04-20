const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Score = require('../models/Score');
const Charity = require('../models/Charity');
const Draw = require('../models/Draw');
const Prize = require('../models/Prize');

// Sabhi users dekho
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Single user dekho
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }
    const subscription = await Subscription.findOne({ userId: user._id });
    const scores = await Score.find({ userId: user._id }).sort({ date: -1 });
    res.status(200).json({ user, subscription, scores });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User delete karo
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }
    await Subscription.findOneAndDelete({ userId: req.params.id });
    await Score.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: 'User delete ho gaya' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Sabhi winners dekho
const getAllWinners = async (req, res) => {
  try {
    const prizes = await Prize.find()
      .populate('userId', 'name email')
      .populate('drawId', 'month winningNumbers')
      .sort({ createdAt: -1 });
    res.status(200).json({ prizes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Winner verify karo
const verifyWinner = async (req, res) => {
  try {
    const { status } = req.body; // verified ya rejected
    const prize = await Prize.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!prize) {
      return res.status(404).json({ message: 'Prize nahi mila' });
    }
    res.status(200).json({ message: `Winner ${status} ho gaya`, prize });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Payout mark karo
const markPaid = async (req, res) => {
  try {
    const prize = await Prize.findByIdAndUpdate(
      req.params.id,
      { status: 'paid' },
      { new: true }
    );
    if (!prize) {
      return res.status(404).json({ message: 'Prize nahi mila' });
    }
    res.status(200).json({ message: 'Payment complete mark ho gayi', prize });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Analytics / Reports
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const totalCharities = await Charity.countDocuments({ isActive: true });
    const totalDraws = await Draw.countDocuments({ status: 'published' });

    // Total prize pool
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalPrizePool = subscriptions.reduce((sum, s) => sum + s.prizePoolContribution, 0);
    const totalCharityContribution = subscriptions.reduce((sum, s) => sum + s.charityContribution, 0);

    // Total winners
    const totalWinners = await Prize.countDocuments();
    const totalPaid = await Prize.countDocuments({ status: 'paid' });
    const totalPending = await Prize.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalUsers,
      activeSubscriptions,
      totalCharities,
      totalDraws,
      totalPrizePool,
      totalCharityContribution,
      totalWinners,
      totalPaid,
      totalPending
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  getAllWinners,
  verifyWinner,
  markPaid,
  getAnalytics
};