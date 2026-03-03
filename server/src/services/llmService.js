/**
 * HireSense AI — LLM Service
 * 
 * Handles all communication with the LLM (OpenAI GPT-4).
 * Manages context windows, token limits, and structured responses.
 */

const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.LLM_MODEL || 'gpt-4';
    this.maxTokens = 1500;
    this.temperature = 0.7;
  }

  /**
   * Send a message in the interview conversation
   */
  async chat(systemPrompt, conversationHistory, userMessage, options = {}) {
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
}

module.exports = new LLMService();
