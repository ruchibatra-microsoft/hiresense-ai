/**
 * HireSense AI — Post-Interview Evaluation Prompt Templates
 * 
 * These prompts generate the structured hire/no-hire decision
 * with company-specific evaluation tone.
 */

const { getCompanyContext } = require('./companyContext');

function buildEvaluationPrompt(company, roundType, conversationHistory, codeSubmissions) {
  const ctx = getCompanyContext(company);
  if (!ctx) throw new Error(`Unknown company: ${company}`);

  const roundCriteria = getRoundCriteria(roundType);

  return `You are the Hiring Committee evaluator for ${ctx.name}. You have just reviewed a complete ${roundType.toUpperCase()} interview. Your job is to provide a STRICT, FAIR evaluation based on ${ctx.name}'s actual hiring standards.

═══ COMPANY EVALUATION TONE ═══
${ctx.scoring.evaluationTone}

═══ HIRING BAR ═══
${ctx.scoring.hiringBar}

═══ SCORING SCALE ═══
${ctx.scoring.scale}

═══ FULL INTERVIEW TRANSCRIPT ═══
${conversationHistory.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n')}

${codeSubmissions && codeSubmissions.length > 0 ? `═══ CODE SUBMISSIONS ═══\n${codeSubmissions.map((s, i) => `\n--- Submission ${i + 1} (${s.language}) ---\n${s.code}\n${s.executionResult ? `Output: ${s.executionResult.output}\nErrors: ${s.executionResult.error || 'None'}` : ''}`).join('\n')}` : ''}

═══ EVALUATION CRITERIA FOR ${roundType.toUpperCase()} ═══
${roundCriteria}

═══ YOUR EVALUATION MUST INCLUDE ═══

Respond ONLY with valid JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "sectionBreakdown": {
    ${getSectionBreakdownTemplate(roundType)}
  },
  "strengths": ["<specific strength 1>", "<specific strength 2>", ...],
  "weaknesses": ["<specific weakness 1>", "<specific weakness 2>", ...],
  "missedOpportunities": ["<what the candidate could have done better>", ...],
  "redFlags": ["<any concerning behavior or gaps>", ...],
  "decision": "<hire | lean-hire | no-hire>",
  "reasoning": "<2-3 paragraph detailed reasoning for the decision, written in ${ctx.name}'s evaluation tone>",
  "companySpecificNotes": "<specific notes about how the candidate aligned or didn't align with ${ctx.name}'s culture and expectations>"
}

═══ EVALUATION RULES ═══
1. Be STRICT but FAIR — use the full 0-100 range
2. 0-30: Clear No Hire — fundamental gaps in skills or understanding
3. 31-50: No Hire — below the bar in multiple areas
4. 51-65: Lean No Hire — some promise but not ready
5. 66-75: Lean Hire — meets the bar with minor concerns
6. 76-90: Hire — solid performance, clearly above the bar
7. 91-100: Strong Hire — exceptional, rare performance
8. Do NOT inflate scores — most candidates should fall in the 40-70 range
9. Red flags in coding ability or communication should lower the score significantly
10. Company culture alignment matters — evaluate through ${ctx.name}'s lens
11. ${company === 'amazon' ? 'Map evaluation to Leadership Principles' : ''}
12. ${company === 'google' ? 'Evaluate Googleyness and problem-solving depth' : ''}
13. ${company === 'meta' ? 'Evaluate speed and execution quality' : ''}
14. ${company === 'microsoft' ? 'Evaluate collaboration and communication clarity' : ''}
15. ${company === 'apple' ? 'Evaluate attention to detail and craftsmanship' : ''}
16. ${company === 'netflix' ? 'Evaluate senior-level judgment and culture fit' : ''}`;
}

function getRoundCriteria(roundType) {
  const criteria = {
    dsa: `
1. Problem Understanding (10%): Did the candidate understand the problem? Ask clarifying questions?
2. Brute Force Attempt (10%): Did they identify a working brute force solution?
3. Optimized Approach (20%): Did they arrive at an optimal or near-optimal solution?
4. Edge Cases (15%): Did they identify and handle edge cases?
5. Clean Code (15%): Is the code clean, readable, and well-structured?
6. Complexity Analysis (15%): Can they analyze time and space complexity correctly?
7. Communication (15%): Did they think aloud, explain their reasoning clearly?`,

    lld: `
1. SOLID Principles (20%): Did the candidate apply SOLID principles naturally?
2. Design Patterns (15%): Were appropriate design patterns identified and used?
3. Extensibility (20%): Can the design accommodate new requirements without major changes?
4. Error Handling (15%): Does the design handle failures gracefully?
5. Object Responsibilities (15%): Are responsibilities well-distributed among classes?
6. Code Quality (15%): Is the implementation clean and well-structured?`,

    hld: `
1. Requirements Gathering (10%): Did they establish clear functional and non-functional requirements?
2. Scalability (15%): Does the design handle growth (10x, 100x)?
3. CAP Theorem (10%): Do they understand consistency vs availability tradeoffs?
4. Database Design (10%): Appropriate database choices with reasoning?
5. Caching (10%): Effective caching strategy at multiple layers?
6. API Design (10%): Clean, versioned API contracts?
7. Bottleneck Identification (10%): Can they identify where the system will break?
8. Tradeoff Analysis (10%): Can they articulate tradeoffs for every decision?
9. Failure Handling (10%): Graceful degradation, circuit breakers, redundancy?
10. Communication (5%): Clear, structured presentation?`,

    behavioral: `
1. STAR Format (20%): Did the candidate structure answers with Situation, Task, Action, Result?
2. Ownership (20%): Did they take personal responsibility for outcomes?
3. Impact (20%): Were results quantified with specific data and metrics?
4. Leadership Signals (20%): Did they demonstrate leadership without formal authority?
5. Data-Driven Results (20%): Were decisions backed by data, not just intuition?`
  };

  return criteria[roundType] || criteria.dsa;
}

function getSectionBreakdownTemplate(roundType) {
  const templates = {
    dsa: `"problemUnderstanding": { "score": <0-100>, "notes": "<brief>" },
    "bruteForce": { "score": <0-100>, "notes": "<brief>" },
    "optimizedApproach": { "score": <0-100>, "notes": "<brief>" },
    "edgeCases": { "score": <0-100>, "notes": "<brief>" },
    "cleanCode": { "score": <0-100>, "notes": "<brief>" },
    "complexityAnalysis": { "score": <0-100>, "notes": "<brief>" },
    "communication": { "score": <0-100>, "notes": "<brief>" }`,

    lld: `"solidPrinciples": { "score": <0-100>, "notes": "<brief>" },
    "designPatterns": { "score": <0-100>, "notes": "<brief>" },
    "extensibility": { "score": <0-100>, "notes": "<brief>" },
    "errorHandling": { "score": <0-100>, "notes": "<brief>" },
    "objectResponsibilities": { "score": <0-100>, "notes": "<brief>" },
    "codeQuality": { "score": <0-100>, "notes": "<brief>" }`,

    hld: `"requirementsGathering": { "score": <0-100>, "notes": "<brief>" },
    "scalability": { "score": <0-100>, "notes": "<brief>" },
    "capTheorem": { "score": <0-100>, "notes": "<brief>" },
    "databaseDesign": { "score": <0-100>, "notes": "<brief>" },
    "caching": { "score": <0-100>, "notes": "<brief>" },
    "apiDesign": { "score": <0-100>, "notes": "<brief>" },
    "bottlenecks": { "score": <0-100>, "notes": "<brief>" },
    "tradeoffs": { "score": <0-100>, "notes": "<brief>" },
    "failureHandling": { "score": <0-100>, "notes": "<brief>" },
    "communication": { "score": <0-100>, "notes": "<brief>" }`,

    behavioral: `"starFormat": { "score": <0-100>, "notes": "<brief>" },
    "ownership": { "score": <0-100>, "notes": "<brief>" },
    "impact": { "score": <0-100>, "notes": "<brief>" },
    "leadershipSignals": { "score": <0-100>, "notes": "<brief>" },
    "dataDrivenResults": { "score": <0-100>, "notes": "<brief>" }`
  };

  return templates[roundType] || templates.dsa;
}

module.exports = { buildEvaluationPrompt };
