const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// Get questions (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { company, roundType, difficulty, topic, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (company) filter.company = company;
    if (roundType) filter.roundType = roundType;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = { $regex: topic, $options: 'i' };

    const questions = await Question.find(filter)
      .select('title description company roundType difficulty topic tags usageCount averageScore')
      .sort({ usageCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      questions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get question stats
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Question.aggregate([
      {
        $group: {
          _id: { company: '$company', roundType: '$roundType' },
          count: { $sum: 1 },
          avgDifficulty: { $avg: { $switch: { branches: [{ case: { $eq: ['$difficulty', 'easy'] }, then: 1 }, { case: { $eq: ['$difficulty', 'medium'] }, then: 2 }, { case: { $eq: ['$difficulty', 'hard'] }, then: 3 }], default: 2 } } }
        }
      },
      { $sort: { '_id.company': 1 } }
    ]);

    const topics = await Question.distinct('topic');

    res.json({ stats, topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
