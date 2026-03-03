/**
 * HireSense AI — Interview Engine
 * 
 * Orchestrates the entire interview flow:
 * - Session management
 * - Dynamic conversation with context memory
 * - Follow-up generation
 * - Difficulty escalation
 * - Interruption logic
 */

const { v4: uuidv4 } = require('uuid');
const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const llmService = require('./llmService');
const { getCompanyContext, getInterviewerPersona } = require('../prompts/companyContext');
const { buildDSASystemPrompt, buildDSAFollowUpPrompt, buildDSAInterruptPrompt } = require('../prompts/dsaPrompts');
const { buildLLDSystemPrompt, buildLLDFollowUpPrompt } = require('../prompts/lldPrompts');
const { buildHLDSystemPrompt, buildHLDFollowUpPrompt } = require('../prompts/hldPrompts');
const { buildBehavioralSystemPrompt, buildBehavioralFollowUpPrompt } = require('../prompts/behavioralPrompts');

class InterviewEngine {

  /**
   * Start a new interview session
   */
  async startInterview(userId, company, roundType, difficulty = 'medium') {
    // Get a question for this company/round/difficulty
    const question = await this.selectQuestion(company, roundType, difficulty);
    const persona = getInterviewerPersona(company);

    const sessionId = uuidv4();

    // Build the system prompt based on round type
    const systemPrompt = this.buildSystemPrompt(company, roundType, difficulty, question);

    // Get the interviewer's opening message
    const openingResponse = await llmService.chat(
      systemPrompt,
      [],
      `[SYSTEM: The interview is starting now. Introduce yourself and present the problem to the candidate. Use your persona introduction, then transition to the problem. Do NOT list the full problem statement in a code block — present it conversationally like a real interviewer would.]`,
      { temperature: 0.8 }
    );

    // Create the session
    const session = new InterviewSession({
      user: userId,
      sessionId,
      company,
      roundType,
      difficulty,
      status: 'in-progress',
      question: {
        id: question._id,
        title: question.title,
        description: question.description,
        topic: question.topic,
        difficulty: question.difficulty
      },
      messages: [
        {
          role: 'system',
          content: `Interview started: ${company} ${roundType} (${difficulty})`,
          metadata: { category: 'system' }
        },
        {
          role: 'interviewer',
          content: openingResponse.content,
          metadata: { category: 'introduction' }
        }
      ],
      timing: {
        totalDuration: this.getDuration(roundType),
        startedAt: new Date()
      },
      interviewerPersona: {
        name: persona.name,
        style: persona.style,
        company
      },
      contextMemory: {
        difficultyLevel: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        followUpCount: 0,
        candidateStruggling: false,
        identifiedWeaknesses: [],
        areasToProbe: []
      }
    });

    await session.save();

    // Increment question usage
    await Question.findByIdAndUpdate(question._id, { $inc: { usageCount: 1 } });

    return {
      sessionId,
      company,
      roundType,
      difficulty,
      interviewerName: persona.name,
      interviewerMessage: openingResponse.content,
      duration: session.timing.totalDuration,
      startedAt: session.timing.startedAt
    };
  }

  /**
   * Process a candidate's message and generate interviewer response
   */
  async processMessage(sessionId, candidateMessage) {
    const session = await InterviewSession.findOne({ sessionId });
    if (!session) throw new Error('Session not found');
    if (session.status !== 'in-progress') throw new Error('Interview is not in progress');

    // Check if time has expired
    const elapsed = (Date.now() - session.timing.startedAt) / 1000;
    if (elapsed >= session.timing.totalDuration) {
      return this.autoSubmit(sessionId);
    }

    // Add candidate message
    session.messages.push({
      role: 'candidate',
      content: candidateMessage,
      metadata: {}
    });

    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(
      session.company,
      session.roundType,
      session.difficulty,
      session.question
    );

    // Analyze candidate context every 3 messages
    if (session.messages.filter(m => m.role === 'candidate').length % 3 === 0) {
      const analysis = await this.analyzeCandidate(session, systemPrompt);
      session.contextMemory = {
        ...session.contextMemory,
        ...analysis,
        followUpCount: session.contextMemory.followUpCount + 1
      };
    }

    // Build follow-up context
    const followUpPrompt = this.buildFollowUpPrompt(session);

    // Generate interviewer response
    const enrichedMessage = followUpPrompt
      ? `${candidateMessage}\n\n[INTERNAL CONTEXT FOR INTERVIEWER - NOT VISIBLE TO CANDIDATE]\n${followUpPrompt}`
      : candidateMessage;

    const response = await llmService.chat(
      systemPrompt,
      session.messages.map(m => ({ role: m.role, content: m.content })),
      enrichedMessage,
      { temperature: 0.7 }
    );

    // Determine response metadata
    const metadata = this.classifyResponse(response.content, session.contextMemory);

    // Add interviewer response
    session.messages.push({
      role: 'interviewer',
      content: response.content,
      metadata
    });

    // Check for time warning
    const remaining = session.timing.totalDuration - elapsed;
    let timeWarning = null;
    if (remaining <= 300 && !session.timing.warningShown) {
      timeWarning = 'You have 5 minutes remaining.';
      session.timing.warningShown = true;
    }

    await session.save();

    return {
      interviewerMessage: response.content,
      metadata,
      timeRemaining: Math.max(0, session.timing.totalDuration - elapsed),
      timeWarning,
      messageCount: session.messages.length
    };
  }

  /**
   * Submit code during DSA round
   */
  async submitCode(sessionId, code, language) {
    const session = await InterviewSession.findOne({ sessionId });
    if (!session) throw new Error('Session not found');

    // Store the code submission
    session.codeSubmissions.push({
      code,
      language,
      submittedAt: new Date()
    });

    // Have the interviewer review the code
    const systemPrompt = this.buildSystemPrompt(
      session.company,
      session.roundType,
      session.difficulty,
      session.question
    );

    const codeReviewMessage = `[The candidate has submitted their code]\n\nLanguage: ${language}\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\n[INTERNAL: Review this code as a real interviewer would. Look for bugs, edge cases, code quality, and ask about complexity. Do NOT say "great job" — ask probing questions. If the code has issues, point them out. If it works, ask about optimization and edge cases.]`;

    const response = await llmService.chat(
      systemPrompt,
      session.messages.map(m => ({ role: m.role, content: m.content })),
      codeReviewMessage,
      { temperature: 0.6 }
    );

    session.messages.push(
      {
        role: 'candidate',
        content: `[Code submitted in ${language}]\n\`\`\`${language}\n${code}\n\`\`\``,
        metadata: { category: 'code-submission' }
      },
      {
        role: 'interviewer',
        content: response.content,
        metadata: { category: 'code-review', isFollowUp: true }
      }
    );

    await session.save();

    return {
      interviewerMessage: response.content,
      submissionIndex: session.codeSubmissions.length - 1
    };
  }

  /**
   * End the interview and generate evaluation
   */
  async endInterview(sessionId) {
    const session = await InterviewSession.findOne({ sessionId });
    if (!session) throw new Error('Session not found');

    session.status = 'completed';
    session.timing.endedAt = new Date();
    session.timing.timeUsed = (session.timing.endedAt - session.timing.startedAt) / 1000;

    // Generate final evaluation
    const evaluation = await require('./evaluationService').evaluateInterview(session);

    session.evaluation = {
      roundType: session.roundType,
      score: evaluation.overallScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      missedOpportunities: evaluation.missedOpportunities,
      redFlags: evaluation.redFlags
    };

    session.finalDecision = {
      overallScore: evaluation.overallScore,
      decision: evaluation.decision,
      reasoning: evaluation.reasoning,
      companyToneEvaluation: evaluation.companySpecificNotes
    };

    await session.save();

    return {
      sessionId,
      evaluation,
      status: 'completed'
    };
  }

  /**
   * Auto-submit when time runs out
   */
  async autoSubmit(sessionId) {
    const session = await InterviewSession.findOne({ sessionId });
    if (!session) throw new Error('Session not found');

    session.status = 'auto-submitted';
    session.timing.autoSubmitted = true;
    session.timing.endedAt = new Date();
    session.timing.timeUsed = session.timing.totalDuration;

    // Add system message about time expiry
    session.messages.push({
      role: 'system',
      content: 'Time has expired. The interview has been auto-submitted.',
      metadata: { category: 'system' }
    });

    await session.save();

    // Generate evaluation
    return this.endInterview(sessionId);
  }

  // ─── Helper Methods ───

  selectQuestion(company, roundType, difficulty) {
    return Question.aggregate([
      { $match: { company: { $in: [company, 'general'] }, roundType, difficulty } },
      { $sample: { size: 1 } }
    ]).then(results => {
      if (results.length === 0) {
        // Fall back to any question of this round type
        return Question.aggregate([
          { $match: { roundType, difficulty } },
          { $sample: { size: 1 } }
        ]).then(r => r[0] || this.getDefaultQuestion(roundType));
      }
      return results[0];
    });
  }

  getDefaultQuestion(roundType) {
    const defaults = {
      dsa: {
        title: 'Two Sum Variants',
        description: 'Given an array of integers and a target, find all unique pairs that sum to the target. Handle duplicates and discuss edge cases. Then optimize for a stream of queries on the same array.',
        topic: 'arrays',
        difficulty: 'medium',
        constraints: ['Array can have duplicates', '1 <= n <= 10^6', '-10^9 <= nums[i] <= 10^9']
      },
      lld: {
        title: 'Design a Parking Lot System',
        description: 'Design an object-oriented parking lot system that supports multiple vehicle types, floors, and payment methods. The system should handle concurrent access and be extensible.',
        topic: 'object-oriented-design',
        difficulty: 'medium'
      },
      hld: {
        title: 'Design a URL Shortener',
        description: 'Design a URL shortening service like bit.ly. It should handle millions of URLs per day, provide analytics, and support custom short URLs.',
        topic: 'system-design',
        difficulty: 'medium'
      },
      behavioral: {
        title: 'Technical Leadership',
        description: 'Tell me about a time you had to lead a technical project with ambiguous requirements. How did you navigate the uncertainty, align stakeholders, and deliver results?',
        topic: 'leadership',
        difficulty: 'medium'
      }
    };
    return defaults[roundType] || defaults.dsa;
  }

  buildSystemPrompt(company, roundType, difficulty, question) {
    switch (roundType) {
      case 'dsa': return buildDSASystemPrompt(company, difficulty, question);
      case 'lld': return buildLLDSystemPrompt(company, difficulty, question);
      case 'hld': return buildHLDSystemPrompt(company, difficulty, question);
      case 'behavioral': return buildBehavioralSystemPrompt(company, question);
      default: return buildDSASystemPrompt(company, difficulty, question);
    }
  }

  buildFollowUpPrompt(session) {
    const context = session.contextMemory;
    switch (session.roundType) {
      case 'dsa': return buildDSAFollowUpPrompt(context);
      case 'lld': return buildLLDFollowUpPrompt(context);
      case 'hld': return buildHLDFollowUpPrompt(context);
      case 'behavioral': return buildBehavioralFollowUpPrompt(context);
      default: return null;
    }
  }

  async analyzeCandidate(session, systemPrompt) {
    return llmService.analyzeContext(
      systemPrompt,
      session.messages.map(m => ({ role: m.role, content: m.content })),
      `Analyze the candidate's performance so far. Are they struggling? What are their weaknesses? Should we escalate difficulty or provide a nudge?`
    );
  }

  classifyResponse(content, context) {
    const lowerContent = content.toLowerCase();
    return {
      isFollowUp: lowerContent.includes('what about') || lowerContent.includes('can you') || lowerContent.includes('how would'),
      isProbing: lowerContent.includes('why') || lowerContent.includes('explain') || lowerContent.includes('walk me through'),
      isInterruption: lowerContent.includes('hold on') || lowerContent.includes('let me stop') || lowerContent.includes('before you'),
      difficultyEscalation: lowerContent.includes('now what if') || lowerContent.includes('harder') || lowerContent.includes('additional constraint'),
      category: this.categorizeResponse(lowerContent)
    };
  }

  categorizeResponse(content) {
    if (content.includes('edge case') || content.includes('what if the input')) return 'edge-case';
    if (content.includes('complexity') || content.includes('time complexity') || content.includes('big o')) return 'complexity';
    if (content.includes('optimize') || content.includes('improve') || content.includes('do better')) return 'optimization';
    if (content.includes('trade') || content.includes('tradeoff')) return 'tradeoff';
    if (content.includes('test') || content.includes('example')) return 'testing';
    if (content.includes('clarif')) return 'clarification';
    return 'general';
  }

  getDuration(roundType) {
    const durations = {
      dsa: 2700,       // 45 minutes
      lld: 2700,       // 45 minutes
      hld: 3600,       // 60 minutes
      behavioral: 2700  // 45 minutes
    };
    return durations[roundType] || 2700;
  }
}

module.exports = new InterviewEngine();
