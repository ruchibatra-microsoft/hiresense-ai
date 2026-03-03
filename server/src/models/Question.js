const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: {
    type: String,
    enum: ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix', 'general'],
    required: true
  },
  roundType: {
    type: String,
    enum: ['dsa', 'lld', 'hld', 'behavioral'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  topic: { type: String, required: true }, // e.g., "trees", "graphs", "caching", "leadership"
  subtopics: [String],
  constraints: [String],
  followUpQuestions: [String],
  expectedApproach: {
    bruteForce: String,
    optimal: String,
    timeComplexity: String,
    spaceComplexity: String
  },
  hints: [String], // NOT shown during interview
  testCases: [{
    input: String,
    expectedOutput: String,
    isEdgeCase: Boolean
  }],
  evaluationCriteria: [{
    criterion: String,
    weight: Number,
    description: String
  }],
  source: {
    type: { type: String, enum: ['scraped', 'manual', 'generated'], default: 'manual' },
    url: String,
    year: Number
  },
  usageCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

questionSchema.index({ company: 1, roundType: 1, difficulty: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);
