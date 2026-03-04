const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { interviewLimiter } = require('../middleware/rateLimit');
const interviewEngine = require('../services/interviewEngine');
const InterviewSession = require('../models/InterviewSession');
const { getAvailableCompanies, getCompanyContext } = require('../prompts/companyContext');

// Get available companies and rounds
router.get('/companies', (req, res) => {
  const companies = getAvailableCompanies();
  res.json({
    companies,
    rounds: ['dsa', 'lld', 'hld', 'behavioral'],
    difficulties: ['easy', 'medium', 'hard']
  });
});

// Get detailed company context (for display on frontend)
router.get('/companies/:company', (req, res) => {
  const ctx = getCompanyContext(req.params.company);
  if (!ctx) return res.status(404).json({ error: 'Company not found' });

  // Return public-facing context (not internal evaluation details)
  res.json({
    name: ctx.name,
    displayName: ctx.displayName,
    color: ctx.color,
    logo: ctx.logo,
    culture: ctx.culture,
    interviewStructure: ctx.interviewStructure,
    rounds: {
      dsa: { commonTopics: ctx.dsa.commonTopics, difficultyDistribution: ctx.dsa.difficultyDistribution },
      lld: { expectations: ctx.lld.expectations.slice(0, 4) },
      hld: { commonTopics: ctx.hld.commonTopics },
      behavioral: { sampleQuestions: ctx.behavioral.sampleLPQuestions || ctx.behavioral.sampleQuestions || ctx.behavioral.expectations.slice(0, 4) }
    },
    persona: { name: ctx.persona.name, title: ctx.persona.title }
  });
});

// Start a new interview
router.post('/start', auth, async (req, res) => {
  try {
    const { company, roundType, difficulty } = req.body;

    if (!company || !roundType) {
      return res.status(400).json({ error: 'Company and round type are required' });
    }

    const validCompanies = ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix'];
    const validRounds = ['dsa', 'lld', 'hld', 'behavioral'];

    if (!validCompanies.includes(company)) {
      return res.status(400).json({ error: `Invalid company. Choose from: ${validCompanies.join(', ')}` });
    }
    if (!validRounds.includes(roundType)) {
      return res.status(400).json({ error: `Invalid round type. Choose from: ${validRounds.join(', ')}` });
    }

    // Check for active interview — auto-end stale ones
    const activeSession = await InterviewSession.findOne({
      user: req.userId,
      status: 'in-progress'
    });
    if (activeSession) {
      // If the active session is older than 2 hours, auto-end it
      const ageMs = Date.now() - new Date(activeSession.createdAt).getTime();
      const twoHours = 2 * 60 * 60 * 1000;
      if (ageMs > twoHours) {
        activeSession.status = 'abandoned';
        activeSession.timing.endedAt = new Date();
        await activeSession.save();
      } else if (req.body.forceEnd) {
        // Allow force-ending from frontend
        try { await interviewEngine.endInterview(activeSession.sessionId); } catch {}
      } else {
        return res.status(400).json({
          error: 'You have an active interview. End it before starting a new one.',
          activeSessionId: activeSession.sessionId,
          canForceEnd: true
        });
      }
    }

    const result = await interviewEngine.startInterview(
      req.userId,
      company,
      roundType,
      difficulty || 'medium'
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send a message during interview
router.post('/:sessionId/message', auth, interviewLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Verify session belongs to user
    const session = await InterviewSession.findOne({
      sessionId: req.params.sessionId,
      user: req.userId
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status !== 'in-progress') {
      return res.status(400).json({ error: 'Interview is not in progress' });
    }

    const result = await interviewEngine.processMessage(
      req.params.sessionId,
      message.trim()
    );

    res.json(result);
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit code (DSA round)
router.post('/:sessionId/code', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const session = await InterviewSession.findOne({
      sessionId: req.params.sessionId,
      user: req.userId
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.roundType !== 'dsa') {
      return res.status(400).json({ error: 'Code submission is only for DSA rounds' });
    }

    const result = await interviewEngine.submitCode(
      req.params.sessionId,
      code,
      language || 'javascript'
    );

    res.json(result);
  } catch (error) {
    console.error('Code submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// End interview
router.post('/:sessionId/end', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      sessionId: req.params.sessionId,
      user: req.userId
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const result = await interviewEngine.endInterview(req.params.sessionId);
    res.json(result);
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get interview session details
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      sessionId: req.params.sessionId,
      user: req.userId
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's interview history
router.get('/', auth, async (req, res) => {
  try {
    const { company, roundType, status, page = 1, limit = 20 } = req.query;

    const filter = { user: req.userId };
    if (company) filter.company = company;
    if (roundType) filter.roundType = roundType;
    if (status) filter.status = status;

    const sessions = await InterviewSession.find(filter)
      .select('sessionId company roundType difficulty status finalDecision timing createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await InterviewSession.countDocuments(filter);

    res.json({
      sessions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
