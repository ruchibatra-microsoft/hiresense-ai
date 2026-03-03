const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');

// Get dashboard overview
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get all completed sessions
    const sessions = await InterviewSession.find({
      user: userId,
      status: { $in: ['completed', 'auto-submitted'] }
    }).sort({ createdAt: -1 });

    // Overall stats
    const totalInterviews = sessions.length;
    const avgScore = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.finalDecision?.overallScore || 0), 0) / sessions.length)
      : 0;

    // Company-wise performance
    const companyPerformance = {};
    const roundPerformance = {};
    const topicWeaknesses = {};
    const scoreHistory = [];

    for (const session of sessions) {
      const company = session.company;
      const round = session.roundType;
      const score = session.finalDecision?.overallScore || 0;
      const topic = session.question?.topic || 'unknown';

      // Company stats
      if (!companyPerformance[company]) {
        companyPerformance[company] = { total: 0, totalScore: 0, hires: 0, noHires: 0 };
      }
      companyPerformance[company].total++;
      companyPerformance[company].totalScore += score;
      if (session.finalDecision?.decision === 'hire') companyPerformance[company].hires++;
      if (session.finalDecision?.decision === 'no-hire') companyPerformance[company].noHires++;

      // Round stats
      if (!roundPerformance[round]) {
        roundPerformance[round] = { total: 0, totalScore: 0, avgScore: 0 };
      }
      roundPerformance[round].total++;
      roundPerformance[round].totalScore += score;

      // Topic weaknesses
      if (score < 60) {
        if (!topicWeaknesses[topic]) topicWeaknesses[topic] = 0;
        topicWeaknesses[topic]++;
      }

      // Score history for trend
      scoreHistory.push({
        date: session.createdAt,
        score,
        company,
        roundType: round,
        decision: session.finalDecision?.decision
      });
    }

    // Calculate averages
    Object.keys(companyPerformance).forEach(c => {
      companyPerformance[c].avgScore = Math.round(companyPerformance[c].totalScore / companyPerformance[c].total);
    });
    Object.keys(roundPerformance).forEach(r => {
      roundPerformance[r].avgScore = Math.round(roundPerformance[r].totalScore / roundPerformance[r].total);
    });

    // Decision distribution
    const decisions = {
      hire: sessions.filter(s => s.finalDecision?.decision === 'hire').length,
      leanHire: sessions.filter(s => s.finalDecision?.decision === 'lean-hire').length,
      noHire: sessions.filter(s => s.finalDecision?.decision === 'no-hire').length
    };

    // Recent sessions
    const recentSessions = sessions.slice(0, 10).map(s => ({
      sessionId: s.sessionId,
      company: s.company,
      roundType: s.roundType,
      difficulty: s.difficulty,
      score: s.finalDecision?.overallScore || 0,
      decision: s.finalDecision?.decision,
      date: s.createdAt
    }));

    // Improvement trend (last 10 sessions)
    const trend = scoreHistory.slice(0, 10).reverse();

    res.json({
      overview: {
        totalInterviews,
        avgScore,
        decisions,
        bestCompany: Object.entries(companyPerformance).sort((a, b) => b[1].avgScore - a[1].avgScore)[0]?.[0] || null,
        worstRound: Object.entries(roundPerformance).sort((a, b) => a[1].avgScore - b[1].avgScore)[0]?.[0] || null
      },
      companyPerformance,
      roundPerformance,
      topicWeaknesses,
      scoreHistory: trend,
      recentSessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed session result
router.get('/results/:sessionId', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      sessionId: req.params.sessionId,
      user: req.userId,
      status: { $in: ['completed', 'auto-submitted'] }
    });

    if (!session) return res.status(404).json({ error: 'Completed session not found' });

    res.json({
      sessionId: session.sessionId,
      company: session.company,
      roundType: session.roundType,
      difficulty: session.difficulty,
      question: session.question,
      evaluation: session.evaluation,
      finalDecision: session.finalDecision,
      timing: session.timing,
      messageCount: session.messages.length,
      codeSubmissions: session.codeSubmissions.length,
      transcript: session.messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        metadata: m.metadata
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
