/**
 * HireSense AI — LLM Service
 * 
 * Handles all communication with the LLM (OpenAI GPT-4).
 * Falls back to mock mode if no API key is configured.
 */

const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.mockMode = !process.env.OPENAI_API_KEY;
    if (!this.mockMode) {
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log('🤖 LLM Service: Using OpenAI GPT-4');
    } else {
      this.client = null;
      console.log('🧪 LLM Service: Running in MOCK mode (no OPENAI_API_KEY set)');
    }
    this.model = process.env.LLM_MODEL || 'gpt-4';
    this.maxTokens = 1500;
    this.temperature = 0.7;
  }

  /**
   * Send a message in the interview conversation
   */
  async chat(systemPrompt, conversationHistory, userMessage, options = {}) {
    // Mock mode fallback
    if (this.mockMode) {
      return this._mockChat(systemPrompt, conversationHistory, userMessage);
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      // Add conversation history (last N messages to stay within context window)
      const historyLimit = options.historyLimit || 30;
      const recentHistory = conversationHistory.slice(-historyLimit);

      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'interviewer' ? 'assistant' : 'user',
          content: msg.content
        });
      }

      // Add the current user message
      if (userMessage) {
        messages.push({ role: 'user', content: userMessage });
      }

      const response = await this.client.chat.completions.create({
        model: options.model || this.model,
        messages,
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
        presence_penalty: 0.6, // Encourage diverse responses
        frequency_penalty: 0.3 // Reduce repetition
      });

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        finishReason: response.choices[0].finish_reason
      };
    } catch (error) {
      console.error('LLM Service Error:', error.message);
      throw new Error(`LLM communication failed: ${error.message}`);
    }
  }

  /**
   * Generate structured evaluation (JSON response)
   */
  async evaluate(evaluationPrompt, options = {}) {
    // Mock mode fallback
    if (this.mockMode) {
      return this._mockEvaluate();
    }

    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.model,
        messages: [
          { role: 'system', content: 'You are a strict technical interview evaluator. Respond ONLY with valid JSON. No markdown, no code fences, no explanation outside the JSON.' },
          { role: 'user', content: evaluationPrompt }
        ],
        max_tokens: options.maxTokens || 3000,
        temperature: 0.3, // Lower temperature for consistent evaluation
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse evaluation response as JSON');
      }
    } catch (error) {
      console.error('LLM Evaluation Error:', error.message);
      throw new Error(`Evaluation failed: ${error.message}`);
    }
  }

  /**
   * Analyze candidate context for dynamic follow-ups
   */
  async analyzeContext(systemPrompt, conversationHistory, analysisPrompt) {
    // Mock mode fallback
    if (this.mockMode) {
      return this._mockAnalyze();
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-20).map(m => ({
          role: m.role === 'interviewer' ? 'assistant' : 'user',
          content: m.content
        })),
        {
          role: 'user',
          content: `[INTERNAL ANALYSIS - NOT PART OF INTERVIEW]\n${analysisPrompt}\n\nRespond with JSON: { "candidateApproach": "", "difficultyLevel": 1-5, "candidateStruggling": bool, "identifiedWeaknesses": [], "areasToProbe": [], "shouldEscalate": bool, "shouldInterrupt": bool, "interruptReason": "" }`
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Context Analysis Error:', error.message);
      return {
        candidateApproach: 'unknown',
        difficultyLevel: 2,
        candidateStruggling: false,
        identifiedWeaknesses: [],
        areasToProbe: [],
        shouldEscalate: false,
        shouldInterrupt: false,
        interruptReason: ''
      };
    }
  }

  // ═══ Mock Mode Methods ═══

  _mockChat(systemPrompt, conversationHistory, userMessage) {
    const candidateMsgCount = conversationHistory.filter(m => m.role === 'candidate').length;
    const isStart = candidateMsgCount === 0 && (userMessage || '').includes('[SYSTEM:');

    const mockResponses = {
      start: [
        `Hi there! I'll be your interviewer today. Thanks for joining — let me set some expectations for this round.\n\nWe have about 45 minutes together. I'll present a problem, and I'd like you to think through it out loud. Don't worry about getting to the perfect solution right away — I'm interested in how you approach the problem.\n\nFeel free to ask me any clarifying questions before you start coding. Ready?\n\nHere's the problem:\n\n**Given an array of integers and a target sum, find all unique pairs of numbers that add up to the target.** Handle duplicate numbers in the array, and each pair should be listed only once.\n\nWhat are your initial thoughts?`,
        `Welcome! I'm going to walk you through a design problem today.\n\nLet me give you the scenario: **Design a parking lot management system.** This system should handle multiple floors, different vehicle types (motorcycles, cars, buses), track available spots, and support automated ticketing.\n\nBefore we start — what clarifying questions do you have about the requirements?`,
      ],
      followUp: [
        `Interesting approach. Can you walk me through the time complexity of that solution? And what happens if the input array is empty?`,
        `I see where you're going with that. Before you code it up — have you considered edge cases? What if there are duplicate values?`,
        `That's a reasonable start, but can we do better? What's the bottleneck in your current approach?`,
        `Good. Now, what are the trade-offs of this approach compared to alternatives? Is there a way to optimize space usage?`,
        `Let me push back a bit — what happens at scale? If we have millions of entries, does your approach still hold up?`,
        `Okay, I'd like you to actually implement this now. Write clean, production-quality code. Think about error handling as well.`,
        `I notice you haven't considered thread safety. What if multiple threads access this concurrently?`,
        `Walk me through your code with this example: input = [2, 7, 11, 15], target = 9. Trace through it step by step.`,
      ],
      codeReview: [
        `I see your code. A few observations:\n\n1. The overall approach looks reasonable\n2. I notice you're not handling the case where the input could be null or empty — that's an edge case to consider\n3. Can you explain the time and space complexity?\n4. What would happen with very large inputs?\n\nLet's discuss your complexity analysis.`,
        `Thanks for the submission. The logic looks mostly correct, but let's test it:\n\n- What does it return for an empty array?\n- What about duplicate elements?\n- Have you thought about negative numbers?\n\nAlso, I'd like to see this refactored for readability. Some of your variable names could be more descriptive.`,
      ],
    };

    let content;
    if (isStart) {
      content = mockResponses.start[Math.floor(Math.random() * mockResponses.start.length)];
    } else if ((userMessage || '').includes('[The candidate has submitted their code]')) {
      content = mockResponses.codeReview[Math.floor(Math.random() * mockResponses.codeReview.length)];
    } else {
      content = mockResponses.followUp[Math.floor(Math.random() * mockResponses.followUp.length)];
    }

    return { content, usage: { total_tokens: 0 }, finishReason: 'stop' };
  }

  _mockEvaluate() {
    const score = Math.floor(Math.random() * 40) + 40; // 40-80 range
    const decision = score >= 76 ? 'hire' : score >= 60 ? 'lean-hire' : 'no-hire';

    return {
      overallScore: score,
      sectionBreakdown: {
        problemUnderstanding: { score: score + 5, notes: 'Candidate showed reasonable understanding of the problem' },
        approach: { score: score - 3, notes: 'Approach was acceptable but could be more optimal' },
        codeQuality: { score: score + 2, notes: 'Code was fairly clean with some areas for improvement' },
        communication: { score: score + 8, notes: 'Communication was clear throughout the interview' },
        edgeCases: { score: score - 10, notes: 'Several edge cases were missed' },
      },
      strengths: [
        'Good communication throughout the interview',
        'Demonstrated understanding of core data structures',
        'Asked relevant clarifying questions',
      ],
      weaknesses: [
        'Did not fully optimize the solution',
        'Missed some edge cases (empty input, duplicates)',
        'Could improve time complexity analysis explanations',
      ],
      missedOpportunities: [
        'Could have discussed space-time tradeoffs more thoroughly',
        'Did not mention alternative approaches',
      ],
      redFlags: score < 50 ? ['Struggled with fundamental concepts'] : [],
      decision,
      reasoning: `The candidate demonstrated a ${score >= 60 ? 'reasonable' : 'below-average'} understanding of the problem and produced a ${score >= 70 ? 'good' : 'partial'} solution. Communication was ${score >= 65 ? 'clear' : 'somewhat unclear'} throughout. ${score >= 76 ? 'Overall performance meets the hiring bar.' : score >= 60 ? 'Performance is borderline — some areas need improvement.' : 'Performance falls below our hiring bar in key areas.'}\n\n[🧪 This is a mock evaluation. Set OPENAI_API_KEY in .env for real AI-powered evaluations.]`,
      companySpecificNotes: 'Mock mode — company-specific evaluation tone will be applied when using the real LLM.'
    };
  }

  _mockAnalyze() {
    return {
      candidateApproach: 'iterative',
      difficultyLevel: 2,
      candidateStruggling: false,
      identifiedWeaknesses: ['edge cases'],
      areasToProbe: ['optimization', 'complexity analysis'],
      shouldEscalate: false,
      shouldInterrupt: false,
      interruptReason: ''
    };
  }
}

module.exports = new LLMService();
