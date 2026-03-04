/**
 * HireSense AI — Evaluation Service
 * 
 * Generates structured evaluations after an interview ends.
 */

const llmService = require('./llmService');
const { buildEvaluationPrompt } = require('../prompts/evaluationPrompts');

class EvaluationService {

  /**
   * Evaluate a completed interview session
   */
  async evaluateInterview(session) {
    const prompt = buildEvaluationPrompt(
      session.company,
      session.roundType,
      session.messages,
      session.codeSubmissions
    );

    const evaluation = await llmService.evaluate(prompt, {
      maxTokens: 3000,
      temperature: 0.3
    });

    // Validate and normalize the evaluation
    return this.normalizeEvaluation(evaluation, session);
  }

  /**
   * Normalize and validate evaluation data
   */
  normalizeEvaluation(evaluation, session) {
    // Ensure score is within range
    const score = Math.max(0, Math.min(100, evaluation.overallScore || 50));

    // Normalize decision to valid enum values: hire, lean-hire, no-hire
    let decision = this.normalizeDecision(evaluation.decision, score);

    return {
      overallScore: score,
      sectionBreakdown: evaluation.sectionBreakdown || {},
      strengths: this.ensureArray(evaluation.strengths, 'No notable strengths identified'),
      weaknesses: this.ensureArray(evaluation.weaknesses, 'Evaluation not detailed enough'),
      missedOpportunities: this.ensureArray(evaluation.missedOpportunities),
      redFlags: this.ensureArray(evaluation.redFlags),
      decision,
      reasoning: evaluation.reasoning || 'Evaluation could not generate detailed reasoning.',
      companySpecificNotes: evaluation.companySpecificNotes || '',
      roundType: session.roundType,
      company: session.company,
      difficulty: session.difficulty,
      timeUsed: session.timing.timeUsed,
      totalMessages: session.messages.length,
      codeSubmissions: session.codeSubmissions.length,
      autoSubmitted: session.timing.autoSubmitted
    };
  }

  ensureArray(arr, defaultMsg) {
    if (Array.isArray(arr) && arr.length > 0) return arr;
    return defaultMsg ? [defaultMsg] : [];
  }

  /**
   * Normalize any LLM decision string to valid enum: hire | lean-hire | no-hire
   */
  normalizeDecision(raw, score) {
    if (!raw) {
      // Fall back to score-based decision
      if (score >= 76) return 'hire';
      if (score >= 60) return 'lean-hire';
      return 'no-hire';
    }

    const d = raw.toLowerCase().replace(/[_\s]+/g, '-').trim();

    // Map all possible LLM outputs to valid values
    if (d.includes('strong-hire') || d === 'hire' || d === 'yes') return 'hire';
    if (d.includes('lean-hire') || d.includes('weak-hire') || d === 'maybe') return 'lean-hire';
    if (d.includes('no-hire') || d.includes('lean-no') || d.includes('strong-no') || d === 'no' || d === 'reject') return 'no-hire';

    // If still unrecognized, use score
    if (score >= 76) return 'hire';
    if (score >= 60) return 'lean-hire';
    return 'no-hire';
  }

  /**
   * Generate a comparative analysis across multiple interviews
   */
  async generateTrendAnalysis(sessions) {
    if (!sessions || sessions.length < 2) return null;

    const summary = sessions.map(s => ({
      company: s.company,
      roundType: s.roundType,
      score: s.finalDecision?.overallScore || 0,
      decision: s.finalDecision?.decision || 'unknown',
      date: s.createdAt,
      weaknesses: s.evaluation?.weaknesses || []
    }));

    const prompt = `Analyze this candidate's interview performance trend:

${JSON.stringify(summary, null, 2)}

Provide a brief analysis as JSON:
{
  "overallTrend": "improving | declining | stable",
  "strongestArea": "<round type>",
  "weakestArea": "<round type>",
  "consistentWeaknesses": ["<weakness that appears across interviews>"],
  "recommendations": ["<specific improvement suggestion>"],
  "readinessLevel": "not-ready | needs-work | almost-ready | interview-ready"
}`;

    return llmService.evaluate(prompt, { maxTokens: 1000 });
  }
}

module.exports = new EvaluationService();
