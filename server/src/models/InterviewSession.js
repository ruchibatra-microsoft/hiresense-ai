const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['interviewer', 'candidate', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    isFollowUp: { type: Boolean, default: false },
    isProbing: { type: Boolean, default: false },
    isHint: { type: Boolean, default: false },
    isInterruption: { type: Boolean, default: false },
    difficultyEscalation: { type: Boolean, default: false },
    category: { type: String } // clarification, optimization, edge-case, tradeoff, etc.
  }
});

const codeSubmissionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  executionResult: {
    output: String,
    error: String,
    runtime: String,
    passed: Boolean
  }
});

const roundEvaluationSchema = new mongoose.Schema({
  roundType: { type: String, enum: ['dsa', 'lld', 'hld', 'behavioral'], required: true },
  score: { type: Number, min: 0, max: 100 },
  criteria: {
    // DSA
    bruteForceAttempt: { score: Number, notes: String },
    optimizedApproach: { score: Number, notes: String },
    edgeCases: { score: Number, notes: String },
    cleanCode: { score: Number, notes: String },
    complexityExplanation: { score: Number, notes: String },
    communicationClarity: { score: Number, notes: String },
    // LLD
    solidPrinciples: { score: Number, notes: String },
    designPatterns: { score: Number, notes: String },
    extensibility: { score: Number, notes: String },
    errorHandling: { score: Number, notes: String },
    objectResponsibilities: { score: Number, notes: String },
    // HLD
    scalability: { score: Number, notes: String },
    capTheorem: { score: Number, notes: String },
    bottlenecks: { score: Number, notes: String },
    databaseChoices: { score: Number, notes: String },
    caching: { score: Number, notes: String },
    tradeoffs: { score: Number, notes: String },
    apiDesign: { score: Number, notes: String },
    failureHandling: { score: Number, notes: String },
    // Behavioral
    starFormat: { score: Number, notes: String },
    ownership: { score: Number, notes: String },
    impact: { score: Number, notes: String },
    leadershipSignals: { score: Number, notes: String },
    dataDrivenResults: { score: Number, notes: String }
  },
  strengths: [String],
  weaknesses: [String],
  missedOpportunities: [String],
  redFlags: [String]
});

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  company: {
    type: String,
    enum: ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix'],
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
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'auto-submitted', 'abandoned'],
    default: 'waiting'
  },
  question: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    title: String,
    description: String,
    topic: String,
    difficulty: String
  },
  messages: [messageSchema],
  codeSubmissions: [codeSubmissionSchema],
  timing: {
    totalDuration: { type: Number, default: 2700 }, // 45 minutes in seconds
    startedAt: Date,
    endedAt: Date,
    timeUsed: Number,
    autoSubmitted: { type: Boolean, default: false },
    warningShown: { type: Boolean, default: false }
  },
  evaluation: roundEvaluationSchema,
  finalDecision: {
    overallScore: { type: Number, min: 0, max: 100 },
    decision: { type: String, enum: ['hire', 'lean-hire', 'no-hire'] },
    reasoning: String,
    companyToneEvaluation: String
  },
  interviewerPersona: {
    name: String,
    style: String,
    company: String
  },
  contextMemory: {
    candidateApproach: String,
    identifiedWeaknesses: [String],
    areasToProbe: [String],
    difficultyLevel: { type: Number, default: 1, min: 1, max: 5 },
    followUpCount: { type: Number, default: 0 },
    candidateStruggling: { type: Boolean, default: false }
  }
}, { timestamps: true });

interviewSessionSchema.index({ user: 1, createdAt: -1 });
interviewSessionSchema.index({ company: 1, roundType: 1 });
interviewSessionSchema.index({ sessionId: 1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
