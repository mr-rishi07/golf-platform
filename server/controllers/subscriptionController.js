const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Plan prices
const PLANS = {
  monthly: 10,   // $10 per month
  yearly: 100    // $100 per year
};

// Subscription banao
const createSubscription = async (req, res) => {
  try {
    const { plan, charityPercentage } = req.body;
    const userId = req.user.id;

    // Plan valid hai?
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan — monthly ya yearly choose karo' });
    }

    // Pehle se subscription hai?
    const existing = await Subscription.findOne({ userId });
    if (existing && existing.status === 'active') {
      return res.status(400).json({ message: 'Aapki subscription already active hai' });
    }

    const amount = PLANS[plan];
    const charityPercent = charityPercentage || 10;

    // Charity contribution calculate karo
    const charityContribution = (amount * charityPercent) / 100;

    // Prize pool contribution (baki amount)
    const prizePoolContribution = amount - charityContribution;

    // Renewal date calculate karo
    const renewalDate = new Date();
    if (plan === 'monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    // Subscription banao
    const subscription = await Subscription.create({
      userId,
      plan,
      status: 'active',
      amount,
      charityPercentage: charityPercent,
      charityContribution,
      prizePoolContribution,
      renewalDate
    });

    // User ka subscription status update karo
    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active' });

    res.status(201).json({ message: 'Subscription active ho gayi', subscription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Subscription dekho
const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Koi subscription nahi mili' });
    }
    res.status(200).json({ subscription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Subscription cancel karo
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription nahi mili' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    await User.findByIdAndUpdate(req.user.id, { subscriptionStatus: 'cancelled' });

    res.status(200).json({ message: 'Subscription cancel ho gayi' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Charity percentage update karo
const updateCharityPercentage = async (req, res) => {
  try {
    const { charityPercentage } = req.body;

    if (charityPercentage < 10 || charityPercentage > 100) {
      return res.status(400).json({ message: 'Charity percentage 10 se 100 ke beech hona chahiye' });
    }

    const subscription = await Subscription.findOne({ userId: req.user.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription nahi mili' });
    }

    const charityContribution = (subscription.amount * charityPercentage) / 100;
    const prizePoolContribution = subscription.amount - charityContribution;

    subscription.charityPercentage = charityPercentage;
    subscription.charityContribution = charityContribution;
    subscription.prizePoolContribution = prizePoolContribution;
    await subscription.save();

    // User model bhi update karo
    await User.findByIdAndUpdate(req.user.id, { charityPercentage });

    res.status(200).json({ message: 'Charity percentage update ho gayi', subscription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Charity Select karo
const selectCharity = async (req, res) => {
  try {
    const { charityId } = req.body;
    await User.findByIdAndUpdate(req.user.id, { charitySelected: charityId });
    res.status(200).json({ message: 'Charity select ho gayi' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSubscription, getSubscription, cancelSubscription, updateCharityPercentage, selectCharity };