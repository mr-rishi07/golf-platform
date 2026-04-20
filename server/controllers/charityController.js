const Charity = require('../models/Charity');

// Sabhi charities dekho (public)
const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true });
    res.status(200).json({ charities });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Single charity dekho
const getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: 'Charity nahi mili' });
    }
    res.status(200).json({ charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Charity banao (admin only)
const createCharity = async (req, res) => {
  try {
    const { name, description, image, isFeatured } = req.body;
    const charity = await Charity.create({ name, description, image, isFeatured });
    res.status(201).json({ message: 'Charity ban gayi', charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Charity update karo (admin only)
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!charity) {
      return res.status(404).json({ message: 'Charity nahi mili' });
    }
    res.status(200).json({ message: 'Charity update ho gayi', charity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Charity delete karo (admin only)
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: 'Charity nahi mili' });
    }
    res.status(200).json({ message: 'Charity delete ho gayi' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCharities, getCharity, createCharity, updateCharity, deleteCharity };