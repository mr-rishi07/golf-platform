const Draw = require('../models/Draw');
const Prize = require('../models/Prize');
const Score = require('../models/Score');
const Subscription = require('../models/Subscription');

// Prize pool distribute karo
const distributePrizePool = (totalPool, previousJackpot = 0) => {
  const jackpot = (totalPool * 0.40) + previousJackpot;
  const fourMatch = totalPool * 0.35;
  const threeMatch = totalPool * 0.25;
  return { jackpot, fourMatch, threeMatch };
};

// Random 5 numbers generate karo (1-45)
const generateRandomNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

// Algorithmic numbers generate karo (score frequency based)
const generateAlgorithmicNumbers = async () => {
  const scores = await Score.find({});
  const frequency = {};

  scores.forEach(s => {
    frequency[s.value] = (frequency[s.value] || 0) + 1;
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => parseInt(entry[0]));

  // Top 5 most frequent numbers
  const numbers = sorted.slice(0, 5);

  // Agar 5 se kam unique scores hain to random se fill karo
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }

  return numbers.sort((a, b) => a - b);
};

// Draw simulate karo (admin)
const simulateDraw = async (req, res) => {
  try {
    const { month, drawType } = req.body;

    // Pehle se draw hai?
    const existing = await Draw.findOne({ month });
    if (existing && existing.status === 'published') {
      return res.status(400).json({ message: 'Is month ka draw already publish ho chuka hai' });
    }

    // Total prize pool calculate karo
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalPool = subscriptions.reduce((sum, s) => sum + s.prizePoolContribution, 0);

    // Previous jackpot check karo
    const lastDraw = await Draw.findOne({ jackpotRolledOver: true }).sort({ createdAt: -1 });
    const previousJackpot = lastDraw ? lastDraw.jackpotAmount : 0;

    // Numbers generate karo
    const winningNumbers = drawType === 'algorithmic'
      ? await generateAlgorithmicNumbers()
      : generateRandomNumbers();

    // Prize pool distribute karo
    const { jackpot, fourMatch, threeMatch } = distributePrizePool(totalPool, previousJackpot);

    // Draw save karo
    const draw = await Draw.findOneAndUpdate(
      { month },
      {
        month,
        drawType: drawType || 'random',
        winningNumbers,
        totalPrizePool: totalPool,
        jackpotAmount: jackpot,
        fourMatchAmount: fourMatch,
        threeMatchAmount: threeMatch,
        previousJackpot,
        status: 'simulated'
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Draw simulate ho gaya', draw });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Draw publish karo (admin)
const publishDraw = async (req, res) => {
  try {
    const { drawId } = req.params;

    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ message: 'Draw nahi mila' });
    }
    if (draw.status === 'published') {
      return res.status(400).json({ message: 'Draw already publish ho chuka hai' });
    }

    // Active subscribers ke scores check karo
    const subscriptions = await Subscription.find({ status: 'active' });
    const winners = { five: [], four: [], three: [] };

    for (const sub of subscriptions) {
      const scores = await Score.find({ userId: sub.userId });
      const userScores = scores.map(s => s.value);
      const matched = userScores.filter(s => draw.winningNumbers.includes(s));

      if (matched.length >= 5) winners.five.push({ userId: sub.userId, matched });
      else if (matched.length === 4) winners.four.push({ userId: sub.userId, matched });
      else if (matched.length === 3) winners.three.push({ userId: sub.userId, matched });
    }

    // Prizes create karo
    // 5 match
    if (winners.five.length > 0) {
      const share = draw.jackpotAmount / winners.five.length;
      for (const w of winners.five) {
        await Prize.create({
          drawId: draw._id,
          userId: w.userId,
          matchType: '5-match',
          amount: share,
          matchedNumbers: w.matched
        });
      }
      draw.jackpotRolledOver = false;
    } else {
      // Jackpot rollover
      draw.jackpotRolledOver = true;
    }

    // 4 match
    if (winners.four.length > 0) {
      const share = draw.fourMatchAmount / winners.four.length;
      for (const w of winners.four) {
        await Prize.create({
          drawId: draw._id,
          userId: w.userId,
          matchType: '4-match',
          amount: share,
          matchedNumbers: w.matched
        });
      }
    }

    // 3 match
    if (winners.three.length > 0) {
      const share = draw.threeMatchAmount / winners.three.length;
      for (const w of winners.three) {
        await Prize.create({
          drawId: draw._id,
          userId: w.userId,
          matchType: '3-match',
          amount: share,
          matchedNumbers: w.matched
        });
      }
    }

    draw.status = 'published';
    await draw.save();

    res.status(200).json({
      message: 'Draw publish ho gaya',
      draw,
      winners: {
        fiveMatch: winners.five.length,
        fourMatch: winners.four.length,
        threeMatch: winners.three.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Draws dekho (public)
const getDraws = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ createdAt: -1 });
    res.status(200).json({ draws });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// User ki winnings dekho
const getMyWinnings = async (req, res) => {
  try {
    const prizes = await Prize.find({ userId: req.user.id })
      .populate('drawId', 'month winningNumbers')
      .sort({ createdAt: -1 });
    res.status(200).json({ prizes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { simulateDraw, publishDraw, getDraws, getMyWinnings };