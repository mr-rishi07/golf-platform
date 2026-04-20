const Score = require('../models/Score');

// Score add karo
const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    const userId = req.user.id;

    // Score range check
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: 'Score 1 se 45 ke beech hona chahiye' });
    }

    // Same date par score already hai?
    const existingScore = await Score.findOne({ userId, date: new Date(date) });
    if (existingScore) {
      return res.status(400).json({ message: 'Is date ka score already exist karta hai' });
    }

    // User ke total scores count karo
    const totalScores = await Score.countDocuments({ userId });

    // Agar 5 se zyada hain to sabse purana delete karo
    if (totalScores >= 5) {
      const oldest = await Score.findOne({ userId }).sort({ date: 1 });
      await Score.findByIdAndDelete(oldest._id);
    }

    // Naya score save karo
    const score = await Score.create({ userId, value, date: new Date(date) });

    res.status(201).json({ message: 'Score add ho gaya', score });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Scores dekho (latest 5)
const getScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const scores = await Score.find({ userId }).sort({ date: -1 });
    res.status(200).json({ scores });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Score edit karo
const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, date } = req.body;
    const userId = req.user.id;

    // Score range check
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: 'Score 1 se 45 ke beech hona chahiye' });
    }

    const score = await Score.findOne({ _id: id, userId });
    if (!score) {
      return res.status(404).json({ message: 'Score nahi mila' });
    }

    score.value = value;
    score.date = new Date(date);
    await score.save();

    res.status(200).json({ message: 'Score update ho gaya', score });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Score delete karo
const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const score = await Score.findOne({ _id: id, userId });
    if (!score) {
      return res.status(404).json({ message: 'Score nahi mila' });
    }

    await Score.findByIdAndDelete(id);
    res.status(200).json({ message: 'Score delete ho gaya' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addScore, getScores, updateScore, deleteScore };