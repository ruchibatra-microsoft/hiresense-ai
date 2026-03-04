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

    // Detect round type and company from the system prompt
    const roundType = systemPrompt.includes('Data Structures & Algorithms') ? 'dsa'
      : systemPrompt.includes('Low Level Design') ? 'lld'
      : systemPrompt.includes('System Design') ? 'hld'
      : systemPrompt.includes('Behavioral') ? 'behavioral' : 'dsa';

    const companyMatch = systemPrompt.match(/INTERVIEW STYLE FOR (\w+)/i);
    const company = companyMatch ? companyMatch[1].toLowerCase() : 'google';

    // Extract question title from system prompt
    const titleMatch = systemPrompt.match(/Title:\s*(.+)/);
    const questionTitle = titleMatch ? titleMatch[1].trim() : '';
    const descMatch = systemPrompt.match(/Description:\s*(.+)/);
    const questionDesc = descMatch ? descMatch[1].trim().substring(0, 200) : '';

    // Extract interviewer name
    const nameMatch = systemPrompt.match(/You are (\w+),/);
    const interviewerName = nameMatch ? nameMatch[1] : 'the interviewer';

    const mockResponses = {
      dsa: {
        start: [
          `Hi, I'm ${interviewerName}. Thanks for joining — let me set expectations for this coding round.\n\nWe have about 45 minutes. I'll give you a problem, and I'd like you to think out loud as you work through it. Don't jump straight to coding — let's discuss your approach first.\n\nHere's the problem:\n\n**${questionTitle || 'Given an array of integers and a target sum, find all unique pairs that add up to the target.'}**\n\n${questionDesc || 'Handle duplicate numbers in the array. Each pair should appear only once.'}\n\nBefore you start — what clarifying questions do you have?`,
          `Hello! I'm ${interviewerName}, and I'll be conducting your coding interview today.\n\nBefore we dive in, here's how this will work: I'll present a problem, and I want to hear you think through it step by step. Start with your initial thoughts, discuss tradeoffs, then we'll move to implementation.\n\n**Problem: ${questionTitle || 'Two Sum Variants'}**\n\n${questionDesc || 'Given an array of integers and a target, find all unique pairs of numbers that sum to the target. Handle duplicates and edge cases.'}\n\nWhat are your initial thoughts? What approach comes to mind first?`
        ],
        followUp: [
          `Interesting approach. Can you walk me through the time complexity? And what happens if the input is empty or has only one element?`,
          `Before you code it — have you considered edge cases? What about duplicate values? Negative numbers?`,
          `That's a reasonable start, but can we do better? What's the bottleneck in your current approach?`,
          `Good thinking. What are the trade-offs of this approach vs alternatives? Can we optimize space usage?`,
          `What happens at scale — say millions of entries? Does your approach still hold up?`,
          `Alright, let's see the code. Write it clean and production-quality. Think about error handling.`,
          `Walk me through your code with this example: input = [2, 7, 11, 15, 2], target = 9. Trace through it step by step.`,
          `I notice a potential issue with that line. What happens when the input contains all identical elements?`
        ]
      },
      lld: {
        start: [
          `Hi, I'm ${interviewerName}. Today we're going to work through a low-level design problem.\n\n**${questionTitle || 'Design a Parking Lot Management System'}**\n\n${questionDesc || 'This system should support multiple floors, different vehicle sizes (motorcycle, car, bus), automated ticketing, and payment processing.'}\n\nLet's start with requirements. What clarifying questions do you have? And then I'd like to hear about the core classes and objects you'd design.`,
          `Hello! I'm ${interviewerName}. For today's round, we'll focus on object-oriented design.\n\nHere's the problem: **${questionTitle || 'Design a Parking Lot System'}**\n\n${questionDesc || 'Think about the key objects, their responsibilities, and how they interact.'}\n\nStart by identifying the core entities. What objects do you see in this problem?`
        ],
        followUp: [
          `Interesting class structure. How does this follow the Single Responsibility Principle? Is any class doing too much?`,
          `What design pattern could help here? Have you considered using Strategy or Factory?`,
          `Good. Now — what if we need to add a new vehicle type, like electric vehicles with charging spots? How much of your design changes?`,
          `How would you handle concurrent access? What if two users try to park in the same spot simultaneously?`,
          `Can you write out the key interfaces and the core class implementations? Let's see the actual code.`,
          `How would you unit test this? What are the key test cases?`,
          `What about error handling — what if a user tries to exit without paying, or the system goes down mid-transaction?`
        ]
      },
      hld: {
        start: [
          `Hi, I'm ${interviewerName}. We're going to work through a system design problem today.\n\n**${questionTitle || 'Design a URL Shortener'}**\n\n${questionDesc || 'Design the system end-to-end. Think about scale — this needs to handle millions of requests.'}\n\nYou have about 45–60 minutes. Where would you like to start? I'd recommend beginning with requirements.`,
          `Hello! I'm ${interviewerName}. Today's round is system design.\n\nThe problem: **${questionTitle || 'Design a Distributed System'}**\n\n${questionDesc || 'Think at scale — millions of users, high availability, low latency.'}\n\nLet's start with the basics. What are the functional and non-functional requirements? Give me some back-of-envelope numbers.`
        ],
        followUp: [
          `Good start on requirements. Can you estimate the QPS? How much storage do we need per day?`,
          `You mentioned using a database — why that choice? What are the tradeoffs vs alternatives?`,
          `Where would you add caching? What eviction policy? How do you handle cache invalidation?`,
          `What happens when this service goes down? How do you handle failure gracefully?`,
          `How does this scale to 10x the current load? Where's the bottleneck?`,
          `Let's talk about the data model. What does the schema look like? How do you shard it?`,
          `Is this system CP or AP under the CAP theorem? Why? What happens during a network partition?`,
          `What's the weakest point of your design? If you had another week, what would you improve?`
        ]
      },
      behavioral: {
        start: [
          `Hi, I'm ${interviewerName}. For this round, I'd like to learn about your experiences and how you approach real-world situations.\n\nI'll ask you a few questions — for each one, I'd like you to use the STAR format: **Situation, Task, Action, Result.** Be specific — give me data and details, not generalizations.\n\nLet's start: **${questionTitle || 'Tell me about a time you had to lead a project with ambiguous requirements.'}**\n\n${questionDesc || 'Walk me through the specific situation and what you did.'}`,
          `Hello! I'm ${interviewerName}. This round focuses on your past experience and how you handle challenges.\n\nA few ground rules: I want **specific** stories, not hypotheticals. Use the STAR format — Situation, Task, Action, Result. And give me **numbers** — metrics, percentages, impact.\n\nHere's my first question: **${questionTitle || 'Tell me about your most impactful project.'}** What was the situation, and what was YOUR specific role?`
        ],
        followUp: [
          `Good story. But what was YOUR specific contribution — not the team's? What did YOU do?`,
          `You mentioned the outcome — can you quantify the impact? What were the metrics?`,
          `What was the biggest challenge in that situation? How did you handle the pushback?`,
          `What would you do differently if you faced that same situation today?`,
          `Tell me about a time you failed. What happened, and what did you learn from it?`,
          `Describe a time you disagreed with a teammate or manager on a technical decision. How did you handle it?`,
          `How did you prioritize when you had multiple competing deadlines?`
        ]
      }
    };

    const roundMocks = mockResponses[roundType] || mockResponses.dsa;

    let content;
    if (isStart) {
      content = roundMocks.start[Math.floor(Math.random() * roundMocks.start.length)];
    } else if ((userMessage || '').includes('[The candidate has submitted their code]')) {
      const codeReviews = [
        `I see your code. A few observations:\n\n1. The overall logic looks reasonable\n2. I notice you're not handling the null/empty input case — that's an edge case to consider\n3. Can you explain the time and space complexity?\n4. What would happen with very large inputs?\n\nLet's discuss your complexity analysis.`,
        `Thanks for the submission. The logic looks mostly correct, but let's test it:\n\n- What does it return for an empty input?\n- What about duplicate elements?\n- Have you thought about negative numbers?\n\nAlso, some variable names could be more descriptive. Walk me through the code line by line.`,
      ];
      content = codeReviews[Math.floor(Math.random() * codeReviews.length)];
    } else {
      content = roundMocks.followUp[Math.floor(Math.random() * roundMocks.followUp.length)];
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
