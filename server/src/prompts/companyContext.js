/**
 * HireSense AI — Deep Company Interview Context
 * 
 * This module contains extensive, detailed context about each company's
 * interview culture, evaluation criteria, expectations, and hiring bar.
 * This is NOT generic — each company profile is built from publicly available
 * information about their real interview processes, culture docs, and hiring philosophy.
 */

const COMPANY_CONTEXTS = {

  // ═══════════════════════════════════════════════════════════════════
  // GOOGLE
  // ═══════════════════════════════════════════════════════════════════
  google: {
    name: 'Google',
    displayName: 'Google (Alphabet)',
    color: '#4285F4',
    logo: '🔵',

    // ─── Culture & Philosophy ───
    culture: {
      summary: `Google's engineering culture is rooted in intellectual curiosity, first-principles thinking, and "Googleyness." They value engineers who can break down ambiguous problems, reason from fundamentals, and demonstrate collaborative intelligence. Google doesn't just want you to solve a problem — they want to see HOW you think through it.`,
      
      coreValues: [
        'Focus on the user and all else will follow',
        'It\'s best to do one thing really, really well',
        'Fast is better than slow',
        'Democracy on the web works',
        'You can be serious without a suit',
        'Great just isn\'t good enough'
      ],

      engineeringPrinciples: [
        'Design for scale from day one — Google operates at planetary scale',
        'Data-driven decision making over gut feeling',
        'Prefer simple, readable solutions over clever ones',
        'Code is written once but read hundreds of times',
        'Invest in testing and reliability',
        'Think in terms of distributed systems by default',
        'Open to being wrong — intellectual humility matters',
        'Build for the 99.999% uptime requirement'
      ],

      whatGoogleynessMeans: `Googleyness is not about fitting a mold. It's about: (1) Doing the right thing — ethical reasoning under ambiguity. (2) Working well with others — thriving in collaborative environments without ego. (3) Intellectual humility — willing to say "I don't know" and learn. (4) Comfort with ambiguity — not needing every requirement spelled out. (5) Bias toward action — not analysis paralysis.`
    },

    // ─── Interview Structure ───
    interviewStructure: {
      totalRounds: '4-5 rounds (phone screen + onsite)',
      duration: '45 minutes per round',
      process: [
        'Recruiter screen (15-30 min) — resume review, role fit',
        'Technical phone screen (45 min) — coding on Google Doc or shared editor',
        'Onsite Round 1: Coding/DSA (45 min)',
        'Onsite Round 2: Coding/DSA (45 min)',
        'Onsite Round 3: System Design (45 min) — for L4+ only',
        'Onsite Round 4: Behavioral / Googleyness & Leadership (45 min)',
        'Hiring Committee review — interviewers don\'t make the decision, the HC does',
        'Team matching — happens after HC approval'
      ],
      hiringCommittee: `Google uses a hiring committee model. Your interviewers submit independent feedback. A committee of senior engineers (who never met you) reviews all feedback packets holistically. This means no single interviewer can torpedo or champion you unfairly. The HC looks for consistent signal across rounds.`,
      leveling: {
        L3: 'Entry-level SWE — new grad or 0-2 years experience',
        L4: 'Mid-level SWE — 2-5 years experience (system design starts here)',
        L5: 'Senior SWE — 5+ years, expected to drive projects end-to-end',
        L6: 'Staff SWE — 8+ years, org-level impact expected'
      }
    },

    // ─── DSA Expectations ───
    dsa: {
      interviewerStyle: `Google DSA interviewers are collaborative but rigorous. They expect you to think out loud, talk through your approach BEFORE coding, ask clarifying questions, and discuss tradeoffs. They want to see you arrive at the optimal solution through structured reasoning — not by pattern-matching. If you jump straight to coding without discussing approach, that's a yellow flag.`,
      
      expectations: [
        'Start with clarifying questions — never assume the full problem',
        'Discuss brute force approach first, then optimize',
        'Analyze time and space complexity for EVERY approach you discuss',
        'Write clean, production-quality code — not pseudocode',
        'Handle edge cases proactively — don\'t wait to be asked',
        'Test your code with examples, trace through it',
        'If stuck, verbalize your thought process — silence is a red flag',
        'Google values algorithm design from first principles over memorized patterns'
      ],

      commonTopics: [
        'Arrays & Strings (two pointers, sliding window)',
        'Hash maps & sets for O(1) lookups',
        'Trees & graphs (BFS, DFS, topological sort)',
        'Dynamic programming (memoization, tabulation)',
        'Binary search on answer space',
        'Greedy algorithms with proof of correctness',
        'Tries, heaps, union-find',
        'Recursion & backtracking'
      ],

      difficultyDistribution: 'Typically medium-hard. Easy problems are rare in on-sites. Expect L5+ candidates to solve hard problems.',

      redFlags: [
        'Jumping to code without discussing approach',
        'Unable to analyze time/space complexity',
        'Not asking any clarifying questions',
        'Writing buggy code and not testing it',
        'Getting defensive when challenged',
        'Over-engineering a simple problem',
        'Cannot explain WHY a solution works',
        'Silence for extended periods without communicating thought process'
      ],

      whatImpresses: [
        'Clean, modular code with meaningful variable names',
        'Proactively identifying and handling edge cases',
        'Discussing multiple approaches and their tradeoffs',
        'Arriving at optimal solution through logical reasoning',
        'Testing code by tracing through examples',
        'Explaining complexity with mathematical reasoning',
        'Asking thoughtful clarifying questions that change the approach'
      ]
    },

    // ─── System Design (HLD) Expectations ───
    hld: {
      interviewerStyle: `Google system design interviewers let you drive. They want to see if you can break down an ambiguous, large-scale problem into manageable pieces. They care deeply about scalability (Google scale = billions of users), data modeling, and understanding tradeoffs. They will push you on bottlenecks, failure modes, and "what happens when X fails?"`,
      
      expectations: [
        'Start with requirements gathering — functional and non-functional',
        'Back-of-the-envelope calculations (QPS, storage, bandwidth)',
        'High-level architecture first, then deep dive',
        'Discuss database choices with reasoning (SQL vs NoSQL, sharding strategy)',
        'Address the CAP theorem explicitly for distributed systems',
        'Discuss caching at every layer (CDN, application, database)',
        'Design for Google-scale: billions of users, petabytes of data',
        'Discuss monitoring, alerting, and observability',
        'Address failure handling, circuit breakers, and graceful degradation',
        'API design with clear contracts'
      ],

      commonTopics: [
        'Design Google Search / Web Crawler',
        'Design YouTube / Video Streaming',
        'Design Google Maps / Location Service',
        'Design Gmail / Email System',
        'Design Google Docs / Real-time Collaboration',
        'Design Google Drive / Cloud Storage',
        'Design a URL Shortener at scale',
        'Design a Notification System',
        'Design a Rate Limiter',
        'Design a Chat System (Google Chat)'
      ]
    },

    // ─── LLD Expectations ───
    lld: {
      interviewerStyle: `Google LLD interviews focus on object-oriented design, clean architecture, and extensibility. The interviewer wants to see SOLID principles applied naturally, not forced. They care about how you decompose a problem into objects and responsibilities.`,
      
      expectations: [
        'Identify core objects and their responsibilities',
        'Apply SOLID principles — especially SRP and OCP',
        'Use appropriate design patterns (Factory, Strategy, Observer, etc.)',
        'Design clean interfaces and APIs',
        'Consider thread safety and concurrency',
        'Think about error handling and edge cases in design',
        'Code should be extensible — "what if we add feature X?"',
        'Write actual code, not just UML diagrams'
      ]
    },

    // ─── Behavioral Expectations ───
    behavioral: {
      interviewerStyle: `Google behavioral rounds evaluate "Googleyness and Leadership" (GnL). This is NOT a "tell me about yourself" session. The interviewer probes for specific behaviors: navigating ambiguity, handling disagreements, leading without authority, and making ethical choices under pressure. STAR format is expected. Vague answers are penalized.`,
      
      expectations: [
        'Use STAR format (Situation, Task, Action, Result) for every answer',
        'Show concrete impact with data — "reduced latency by 40%"',
        'Demonstrate leading without authority',
        'Show comfort with ambiguity and changing requirements',
        'Demonstrate intellectual humility — "I was wrong about X and here\'s what I learned"',
        'Show ethical reasoning under pressure',
        'Demonstrate collaborative problem-solving, not hero culture',
        'Show growth mindset and continuous learning'
      ],

      leadershipPrinciples: [
        'Navigate ambiguity with structured thinking',
        'Influence without authority',
        'Make data-driven decisions',
        'Drive for technical excellence',
        'Collaborate across teams and functions',
        'Mentor and grow others',
        'Take ownership of outcomes, not just tasks'
      ]
    },

    // ─── Scoring & Decision ───
    scoring: {
      scale: 'Google uses a 1-4 scale internally: Strong No Hire (1), Lean No Hire (2), Lean Hire (3), Strong Hire (4)',
      hiringBar: `The hiring bar at Google is extremely high. A "Lean Hire" from most interviewers is often enough if there are no "Strong No Hire" signals. The Hiring Committee looks for consistency — one bad round can be compensated by strong performance in others, but red flags in coding or Googleyness are hard to overcome.`,
      evaluationTone: 'Analytical, methodical, depth-focused. Google cares about problem-solving depth over breadth. They want to see how deep you can go on a single problem rather than surface-level knowledge of many topics.'
    },

    // ─── Interviewer Persona ───
    persona: {
      name: 'Priya',
      title: 'Senior Software Engineer, Google Cloud',
      style: 'Collaborative but challenging. Asks "why?" a lot. Pushes for depth. Gives minimal hints. Expects you to drive.',
      introduction: `Hi, I'm Priya. I'm a Senior Software Engineer on the Google Cloud team. I'll be your interviewer for this round. Before we start, I want you to know — there are no tricks here. I'm looking to understand how you think, how you approach problems, and how you communicate your reasoning. Feel free to ask me clarifying questions at any point. I'd rather you ask than assume. Ready to get started?`
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // AMAZON
  // ═══════════════════════════════════════════════════════════════════
  amazon: {
    name: 'Amazon',
    displayName: 'Amazon (AWS)',
    color: '#FF9900',
    logo: '🟠',

    culture: {
      summary: `Amazon's culture is defined by its 16 Leadership Principles (LPs). Every interview question, every evaluation, and every hiring decision maps back to these principles. Amazon wants "builders" — people who are biased toward action, think big, and obsess over the customer. The LP bar-raiser interview is unique to Amazon and can single-handedly block a hire.`,
      
      coreValues: [
        'Customer Obsession — start with the customer and work backwards',
        'Ownership — think long-term, act on behalf of the entire company',
        'Invent and Simplify — expect and require innovation',
        'Are Right, A Lot — strong judgment and good instincts',
        'Learn and Be Curious — never stop learning',
        'Hire and Develop the Best — raise the performance bar',
        'Insist on the Highest Standards — relentlessly high standards',
        'Think Big — create and communicate a bold direction',
        'Bias for Action — speed matters in business',
        'Frugality — accomplish more with less',
        'Earn Trust — listen attentively, speak candidly, treat others respectfully',
        'Dive Deep — operate at all levels, stay connected to details',
        'Have Backbone; Disagree and Commit — respectfully challenge, then commit',
        'Deliver Results — focus on key inputs and deliver with the right quality',
        'Strive to be Earth\'s Best Employer — work environment safety and empowerment',
        'Success and Scale Bring Broad Responsibility — do better every day'
      ],

      engineeringPrinciples: [
        'Two-pizza teams — small, autonomous, and accountable',
        'Working backwards from the customer (PR/FAQ documents)',
        'Service-oriented architecture — everything is a service',
        'Operational excellence — you build it, you run it',
        'Data-driven everything — metrics, dashboards, alarms',
        'Think about scale and cost from day one',
        'Automate everything that can be automated',
        'Write docs first, code second (narrative-style documents, not slides)'
      ]
    },

    interviewStructure: {
      totalRounds: '4-5 rounds (phone screen + onsite loop)',
      duration: '45-60 minutes per round',
      process: [
        'Online Assessment (OA) — 2 coding problems + work simulation',
        'Phone screen (60 min) — coding + LP behavioral questions',
        'Onsite Loop Day (4-5 back-to-back rounds):',
        '  - Round 1: DSA/Coding + LP deep-dive',
        '  - Round 2: DSA/Coding + LP deep-dive',
        '  - Round 3: System Design (L5+) + LP questions',
        '  - Round 4: Bar Raiser round — senior Amazonian from different org',
        '  - Round 5 (optional): Hiring Manager round',
        'Debrief — all interviewers must agree, Bar Raiser has veto power',
        'Bar Raiser can single-handedly reject a candidate'
      ],
      barRaiser: `The Bar Raiser is a specially trained interviewer from a completely different team. Their job is to ensure Amazon's hiring bar doesn't drop. They have veto power — if the BR says "no hire," you don't get hired, period. The BR specifically tests for LP alignment and long-term potential at Amazon.`
    },

    dsa: {
      interviewerStyle: `Amazon DSA interviewers are practical and execution-focused. They want working code fast. They care about clean code but also about speed of execution. Every DSA round also includes 10-15 minutes of behavioral questions mapped to Leadership Principles. You'll be asked to code AND tell stories about your past experience in the same interview.`,
      
      expectations: [
        'Solve problems efficiently — Amazon values speed of execution',
        'Write complete, compilable code — not pseudocode',
        'Handle edge cases — think about production scenarios',
        'Discuss time/space complexity clearly',
        'Show "Bias for Action" — don\'t overthink, start with a working solution',
        'Be prepared for LP questions mid-interview ("Tell me about a time when...")',
        'Show "Dive Deep" — demonstrate understanding of underlying data structures',
        'Code should be production-ready, not interview-quality'
      ],

      commonTopics: [
        'Arrays & Strings (frequent at Amazon OA)',
        'Graphs — BFS/DFS (Amazon loves graph problems)',
        'Trees — BST, tries, n-ary trees',
        'Dynamic programming',
        'Greedy algorithms',
        'Hash maps and sorting',
        'Stack and queue problems',
        'Two pointers and sliding window'
      ],

      redFlags: [
        'Cannot produce working code within time limit',
        'Does not ask clarifying questions',
        'Cannot discuss tradeoffs between approaches',
        'Shows no LP alignment in behavioral answers',
        'Over-engineers simple problems (violates "Frugality")',
        'Gives vague behavioral answers without concrete metrics',
        'Cannot handle being challenged — lacks "Earn Trust"',
        'Does not test their code'
      ]
    },

    hld: {
      interviewerStyle: `Amazon system design rounds are practical, service-oriented, and AWS-aware. They want you to think in terms of microservices, queues, and event-driven architecture. They'll ask about operational concerns: "How would you monitor this? What happens when your database goes down? How would you handle a spike in traffic?" Amazon's "you build it, you run it" philosophy means operational excellence is key.`,
      
      expectations: [
        'Think in microservices — Amazon pioneered SOA',
        'Use AWS services where appropriate (SQS, DynamoDB, S3, Lambda, etc.)',
        'Address operational concerns: monitoring, alerting, logging',
        'Design for failure — everything fails at scale',
        'Discuss database choices: DynamoDB vs RDS vs Aurora',
        'Show cost-awareness — frugality is a leadership principle',
        'Address data consistency (eventual vs strong)',
        'Discuss API design — REST with clear contracts',
        'Think about security, authentication, and authorization',
        'Show capacity planning and auto-scaling strategy'
      ],

      commonTopics: [
        'Design Amazon.com product page',
        'Design Amazon order processing system',
        'Design a recommendation engine',
        'Design Amazon Prime Video streaming',
        'Design a distributed cache (ElastiCache)',
        'Design a notification system at scale',
        'Design a ride-sharing service',
        'Design an inventory management system',
        'Design a food delivery system',
        'Design a ticket booking system'
      ]
    },

    lld: {
      interviewerStyle: `Amazon LLD rounds focus on practical design — building systems that are maintainable, testable, and extensible. They value clean abstractions and clear ownership of responsibilities between classes.`,
      
      expectations: [
        'Clear class hierarchy with well-defined responsibilities',
        'Apply SOLID principles naturally',
        'Design patterns where appropriate — don\'t force them',
        'Think about error handling and edge cases',
        'Consider thread safety for concurrent systems',
        'Write actual code — Amazon wants to see implementation',
        'Think about extensibility: "What if we add a new feature?"',
        'Consider testing — how would you test this design?'
      ]
    },

    behavioral: {
      interviewerStyle: `Amazon behavioral interviews are the most structured of any big tech company. EVERY question maps to a specific Leadership Principle. The interviewer will probe deeply using the STAR method. They'll ask "why?", "what was your specific contribution?", "what would you do differently?", and "what data did you use?" Vague answers that don't demonstrate specific LPs are immediate yellow flags.`,
      
      expectations: [
        'STAR format is MANDATORY — no exceptions',
        'Every story must map to a specific Leadership Principle',
        'Quantify impact with data: "reduced costs by 30%", "improved latency by 2x"',
        'Show ownership — "I" not "we" for your specific contributions',
        'Demonstrate "Customer Obsession" — how did the customer benefit?',
        'Show "Bias for Action" — what did you do without being asked?',
        'Show "Disagree and Commit" — a time you pushed back on a decision',
        'Show "Deliver Results" — concrete outcomes, not just effort',
        'Have 8-10 stories prepared that map to different LPs',
        'Be ready for follow-up: "What was the metric impact?"'
      ],

      sampleLPQuestions: [
        'Customer Obsession: Tell me about a time you went above and beyond for a customer.',
        'Ownership: Tell me about a time you took on something outside your area of responsibility.',
        'Dive Deep: Tell me about a time you had to dig into data to solve a problem.',
        'Bias for Action: Tell me about a time you took a calculated risk.',
        'Earn Trust: Tell me about a time you had to deliver bad news.',
        'Have Backbone: Tell me about a time you disagreed with your manager.',
        'Deliver Results: Tell me about a time you delivered a project under tight deadline.',
        'Invent and Simplify: Tell me about a time you simplified a complex process.'
      ]
    },

    scoring: {
      scale: 'Amazon uses: Strong Hire, Hire, Lean Hire, Lean No Hire, Strong No Hire',
      hiringBar: `Amazon's bar is set by the Bar Raiser. Every interviewer maps their feedback to specific LPs. The debrief requires consensus — a single "Strong No Hire" from the Bar Raiser blocks the hire. Amazon would rather miss a great candidate than hire a bad one.`,
      evaluationTone: 'Execution-focused, LP-aligned, results-driven. Amazon cares about what you DELIVERED and the concrete impact. They push hard on "what was YOUR role specifically?"'
    },

    persona: {
      name: 'Marcus',
      title: 'Senior SDE II, Amazon Web Services',
      style: 'Direct, LP-focused, pushes for specifics. Will interrupt vague answers. Demands data and metrics.',
      introduction: `Hey, I'm Marcus. I'm a Senior SDE on the AWS team. Today we're going to work through a technical problem together, and I'll also ask you some behavioral questions. For the behavioral portion, I find it most helpful when you use the STAR format — Situation, Task, Action, Result. Be specific — I'll ask follow-ups if I need more detail. For the technical portion, think out loud and let me know your reasoning. Let's jump in.`
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // MICROSOFT
  // ═══════════════════════════════════════════════════════════════════
  microsoft: {
    name: 'Microsoft',
    displayName: 'Microsoft',
    color: '#00A4EF',
    logo: '🔷',

    culture: {
      summary: `Under Satya Nadella's leadership, Microsoft transformed from a "know-it-all" to a "learn-it-all" culture. They value growth mindset, collaboration, and empathy. Microsoft interviews look for people who can work across teams, communicate clearly, and build inclusive products. The "as-appropriate" (AA) round with a senior leader is the final hurdle.`,
      
      coreValues: [
        'Growth mindset — every failure is a learning opportunity',
        'Diversity and inclusion — build products for everyone',
        'Customer obsession — empower every person and organization',
        'One Microsoft — break down silos, collaborate across teams',
        'Innovation with purpose — technology should serve humanity',
        'Trust and integrity — earn trust through transparency'
      ],

      engineeringPrinciples: [
        'Growth mindset over fixed mindset — always be learning',
        'Customer empathy — understand who you\'re building for',
        'Engineering excellence with practical tradeoffs',
        'Cross-team collaboration is essential, not optional',
        'Accessibility and inclusive design from the start',
        'DevOps culture — shift left on quality',
        'Data-informed decision making',
        'Security and privacy by design',
        'Think in platforms — build for extensibility'
      ]
    },

    interviewStructure: {
      totalRounds: '4-5 rounds (phone screen + onsite)',
      duration: '45-60 minutes per round',
      process: [
        'Recruiter screen — role fit and expectations',
        'Technical phone screen (45-60 min) — coding + design discussion',
        'Onsite Interview Day:',
        '  - Round 1: Coding/DSA (45 min)',
        '  - Round 2: Coding/DSA or LLD (45 min)',
        '  - Round 3: System Design (60 min) — for SDE II+ only',
        '  - Round 4: Behavioral / Culture fit (45 min)',
        '  - "As Appropriate" (AA) Round: Senior leader (Director+) — final hiring decision',
        'The AA interviewer makes the go/no-go call',
        'Team matching may happen before or after onsite'
      ],
      asAppropriate: `The "As Appropriate" (AA) round is unique to Microsoft. A senior leader (usually Director level or above) conducts the final interview. This person has the authority to make the final hiring decision. They evaluate your overall fit, senior potential, and alignment with Microsoft's culture. This is the most important round.`
    },

    dsa: {
      interviewerStyle: `Microsoft DSA interviewers are collaborative and patient. They want to see clear thinking and clean communication. Microsoft is less about speed and more about clarity — can you explain your approach so a team member would understand? They often give practical, real-world-flavored problems rather than pure algorithm puzzles.`,
      
      expectations: [
        'Communicate clearly — explain your thought process as you go',
        'Ask clarifying questions to understand the problem fully',
        'Discuss multiple approaches and their tradeoffs',
        'Write clean, readable code with proper naming',
        'Consider error handling and input validation',
        'Think about how this code would work in a production system',
        'Discuss testing strategy — how would you test this?',
        'Show growth mindset — be open to feedback mid-interview',
        'Collaboration matters — this is a conversation, not an exam'
      ],

      commonTopics: [
        'Arrays and strings',
        'Linked lists and trees',
        'Graph traversals',
        'Dynamic programming',
        'Binary search applications',
        'Stack and queue problems',
        'Hash map based problems',
        'Recursion and backtracking'
      ],

      redFlags: [
        'Cannot communicate approach clearly',
        'Defensive when given feedback or hints',
        'Writes code that others couldn\'t understand',
        'Doesn\'t consider edge cases or error handling',
        'Shows no collaborative instincts',
        'Cannot discuss tradeoffs',
        'Fixed mindset — not open to alternative approaches',
        'Arrogant or dismissive — violates culture values'
      ]
    },

    hld: {
      interviewerStyle: `Microsoft system design interviewers value clarity, practicality, and customer focus. They want to see you think about Azure services naturally. They care about security, accessibility, and compliance — things many candidates overlook. Cross-service integration and platform thinking are valued.`,
      
      expectations: [
        'Start with customer scenarios — who uses this and how?',
        'Define clear functional and non-functional requirements',
        'Think in terms of Azure services (but not required to use Azure)',
        'Address security and compliance requirements',
        'Discuss authentication and authorization (Azure AD/Entra ID)',
        'Consider accessibility in system design',
        'Think about global distribution and multi-region deployment',
        'Discuss monitoring and telemetry (Application Insights pattern)',
        'Address data privacy and GDPR-like requirements',
        'Design clean APIs with proper versioning'
      ]
    },

    lld: {
      interviewerStyle: `Microsoft LLD rounds value clean design, testability, and extensibility. They often give practical scenarios — design a feature for a real Microsoft product. They want to see your design thinking process.`,
      
      expectations: [
        'Clean separation of concerns',
        'SOLID principles applied thoughtfully',
        'Design for testability — dependency injection, interfaces',
        'Consider accessibility in your design',
        'Think about cross-platform scenarios',
        'Use appropriate design patterns',
        'Write clear, self-documenting code',
        'Consider backward compatibility'
      ]
    },

    behavioral: {
      interviewerStyle: `Microsoft behavioral rounds focus on growth mindset, collaboration, and inclusive leadership. They want specific examples of how you've grown from failures, worked across teams, and built inclusive environments. The AA round especially probes for culture fit and leadership potential.`,
      
      expectations: [
        'Demonstrate growth mindset — failures you learned from',
        'Show collaboration across teams and disciplines',
        'Examples of inclusive behavior — supporting diverse perspectives',
        'Customer empathy — understanding user needs',
        'Conflict resolution — how you handle disagreements',
        'Technical leadership — driving technical decisions',
        'Mentoring and growing others',
        'Show how you give and receive feedback constructively'
      ],

      sampleQuestions: [
        'Tell me about a time you failed and what you learned.',
        'How do you handle disagreements with team members?',
        'Describe a situation where you had to collaborate with a difficult colleague.',
        'Tell me about a time you advocated for an inclusive approach.',
        'How do you give feedback to team members?',
        'Tell me about a time you changed your mind about a technical decision.',
        'How do you stay current with new technologies?',
        'Describe a time you mentored someone.'
      ]
    },

    scoring: {
      scale: 'Microsoft uses: Strong Hire, Hire, Weak Hire, Weak No Hire, Strong No Hire',
      hiringBar: `Microsoft's hiring bar emphasizes collaboration and clarity. The AA (As Appropriate) interviewer has significant weight. Microsoft values candidates who demonstrate growth mindset and would elevate team culture.`,
      evaluationTone: 'Collaborative, clarity-focused, growth-mindset oriented. Microsoft values how you think and communicate over raw speed. They want to see someone they\'d enjoy working with every day.'
    },

    persona: {
      name: 'Sarah',
      title: 'Principal Software Engineer, Microsoft Azure',
      style: 'Warm but thorough. Encourages collaboration. Values clear communication. Will ask "how would you explain this to a junior engineer?"',
      introduction: `Hi there! I'm Sarah, a Principal Engineer on Azure. Today we'll work through a problem together — think of it as a collaborative design session rather than an exam. I want to understand how you approach problems, how you communicate your ideas, and how you handle ambiguity. Don't worry about getting everything perfect — I'm more interested in your thought process. Feel free to ask me anything. Shall we begin?`
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // META (Facebook)
  // ═══════════════════════════════════════════════════════════════════
  meta: {
    name: 'Meta',
    displayName: 'Meta (Facebook)',
    color: '#0668E1',
    logo: '🔵',

    culture: {
      summary: `Meta's engineering culture is built on speed, impact, and moving fast. Their famous motto was "Move Fast and Break Things" — now evolved to "Move Fast with Stable Infrastructure." Meta values engineers who can ship quickly, iterate rapidly, and have outsized impact. They want people who can take an ambiguous problem, ship a v1, and iterate based on data.`,
      
      coreValues: [
        'Move Fast — speed of execution is a competitive advantage',
        'Be Bold — take risks, fail fast, learn faster',
        'Focus on Impact — work on what matters most',
        'Be Open — transparent communication and decision making',
        'Build Social Value — create products that bring people together',
        'Meta-first thinking — optimize for the whole company, not just your team'
      ],

      engineeringPrinciples: [
        'Ship early, ship often — iterate based on data',
        'Code wins arguments — build a prototype to prove your point',
        'Focus on impact — what moves the needle the most?',
        'Think in terms of billions of users',
        'Mobile-first and performance-obsessed',
        'Data-driven everything — A/B test relentlessly',
        'Prefer simple solutions that ship today over perfect solutions that ship next month',
        'Hackathon culture — innovation comes from everywhere',
        'Flat hierarchy — ICs can have massive impact',
        'Infrastructure as a competitive advantage'
      ]
    },

    interviewStructure: {
      totalRounds: '3-4 rounds (phone + onsite)',
      duration: '45 minutes per round',
      process: [
        'Recruiter screen — role fit',
        'Technical phone screen (45 min) — 2 coding problems on CoderPad',
        'Onsite (Virtual or In-person):',
        '  - Round 1: Coding (45 min) — 2 problems, focus on speed and correctness',
        '  - Round 2: Coding (45 min) — 2 problems, increasing difficulty',
        '  - Round 3: System Design (45 min) — E5+ only',
        '  - Round 4: Behavioral (30-45 min) — "Why Meta?" + past experience',
        'Post-interview review by hiring committee',
        'Team matching happens after offer (bootcamp model)'
      ],
      bootcamp: `Meta uses a "bootcamp" model — new engineers join a 6-week bootcamp where they work on real code across different teams, then choose their permanent team. This means interviews are team-agnostic.`
    },

    dsa: {
      interviewerStyle: `Meta DSA interviews are FAST. You typically get 2 problems in 45 minutes — that's ~20 minutes per problem including discussion. There's no time to be slow or deliberate. Meta values speed and accuracy. The interviewer expects you to identify the pattern quickly, code it up, and move on. If you solve the first problem fast, expect a harder follow-up. This is the most time-pressured DSA interview in big tech.`,
      
      expectations: [
        'SPEED is critical — solve 2 problems in 45 minutes',
        'Identify patterns quickly — no time for extended exploration',
        'Write correct code on the first attempt',
        'Minimize bugs — there\'s no time for extensive debugging',
        'Optimal solution expected for at least one problem',
        'Brief complexity analysis — don\'t spend 5 minutes on it',
        'Communication should be concise, not verbose',
        'If you know the pattern, state it and implement immediately',
        'Meta interviewers expect proficiency, not teaching moments'
      ],

      commonTopics: [
        'Arrays and strings (most common)',
        'Hash maps and hash sets',
        'Trees and graphs (BFS/DFS)',
        'Binary search',
        'Two pointers and sliding window',
        'Dynamic programming (medium-level)',
        'Stack and queue applications',
        'Interval problems'
      ],

      redFlags: [
        'Too slow — cannot solve 2 problems in time',
        'Needs excessive hints for medium-level problems',
        'Code is buggy and requires multiple iterations',
        'Cannot optimize beyond brute force',
        'Poor time management — spends too long on first problem',
        'Doesn\'t communicate approach before coding',
        'Cannot handle pressure of time constraints'
      ]
    },

    hld: {
      interviewerStyle: `Meta system design is practical and product-focused. They'll often ask you to design something Meta actually builds — a social feed, messaging system, or live video platform. They want to see you think at Meta's scale (3+ billion users) and understand the tradeoffs of consistency vs availability in social systems. They value product thinking alongside technical depth.`,
      
      expectations: [
        'Think at Meta scale — 3+ billion monthly active users',
        'Product-aware design — understand the user experience implications',
        'News Feed ranking and personalization concepts',
        'Real-time systems: messaging, notifications, live streaming',
        'Social graph data modeling and traversal',
        'Content delivery and caching at massive scale',
        'Data pipeline design for analytics and ML',
        'Mobile-first architecture considerations',
        'Privacy and data protection in design',
        'A/B testing infrastructure integration'
      ],

      commonTopics: [
        'Design Facebook News Feed',
        'Design Instagram Stories',
        'Design Facebook Messenger',
        'Design WhatsApp',
        'Design a Social Graph',
        'Design Facebook Live / Video Streaming',
        'Design a Photo Sharing Service',
        'Design a Content Moderation System',
        'Design Facebook Marketplace',
        'Design a Notification System'
      ]
    },

    lld: {
      interviewerStyle: `Meta LLD rounds (less common than DSA) focus on clean, practical design. They want to see you build something quickly with good structure — not over-engineer it.`,
      
      expectations: [
        'Fast, pragmatic design — don\'t over-engineer',
        'Clean interfaces and clear abstractions',
        'Focus on the core functionality first',
        'Extensible but not gold-plated',
        'Consider mobile/client-side design',
        'Think about performance implications',
        'Write real, working code',
        'Ship the MVP first, then extend'
      ]
    },

    behavioral: {
      interviewerStyle: `Meta behavioral rounds are less structured than Amazon's but still probe for impact and execution. They care about: Why Meta? What's the biggest impact you've had? How do you prioritize? How do you handle moving fast with quality? They want builders who ship.`,
      
      expectations: [
        'Focus on IMPACT — what changed because of your work?',
        'Show you can move fast without breaking things',
        'Demonstrate product sense — why does it matter to users?',
        'Show you can work in ambiguous environments',
        'Quantify results with data',
        'Show collaboration on cross-functional projects',
        'Demonstrate ownership of outcomes',
        'Show adaptability — how you handle changing priorities'
      ]
    },

    scoring: {
      scale: 'Meta uses: Strong Hire, Hire, Lean Hire, Lean No Hire, No Hire',
      hiringBar: `Meta's coding bar is high because speed matters. They expect candidates to solve problems quickly and correctly. System design focuses on Meta-scale products. The behavioral round assesses culture fit and impact orientation.`,
      evaluationTone: 'Speed-focused, impact-driven, execution-oriented. Meta cares about how fast you can produce quality work and the magnitude of your impact. They value builders who ship over thinkers who plan.'
    },

    persona: {
      name: 'Alex',
      title: 'Staff Engineer, Meta Infrastructure',
      style: 'Fast-paced, direct, impact-focused. Will move quickly through problems. Expects concise answers.',
      introduction: `Hey, I'm Alex — Staff Engineer on Meta's Infrastructure team. We've got 45 minutes and a couple of problems to work through. I'll give you a problem, you talk me through your approach briefly, then let's see the code. Speed and correctness both matter. Ready? Let's go.`
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // APPLE
  // ═══════════════════════════════════════════════════════════════════
  apple: {
    name: 'Apple',
    displayName: 'Apple Inc.',
    color: '#555555',
    logo: '⚫',

    culture: {
      summary: `Apple's culture is defined by obsessive attention to detail, craftsmanship, and secrecy. They want engineers who care deeply about the user experience, sweat the small stuff, and can work in a highly focused, team-specific environment. Apple interviews are team-specific (unlike Meta's bootcamp model) — you interview for a specific team and role.`,
      
      coreValues: [
        'Attention to detail — every pixel matters',
        'Simplicity — make complex things simple',
        'Privacy as a fundamental human right',
        'Integration of hardware and software',
        'Craftsmanship — build products you\'re proud of',
        'Innovation through intersection of technology and liberal arts',
        'Secrecy and focus — work on what matters without distraction'
      ],

      engineeringPrinciples: [
        'Ship fewer things but make them exceptional',
        'User experience drives technical decisions',
        'Performance and battery life are features',
        'Privacy by design — minimize data collection',
        'Integration thinking — hardware + software + services',
        'Attention to edge cases and error states',
        'Accessibility is not optional — it\'s core',
        'Test obsessively — quality is non-negotiable',
        'Think about the physical device and its constraints',
        'Design for delight, not just functionality'
      ]
    },

    interviewStructure: {
      totalRounds: '5-6 rounds (phone + onsite)',
      duration: '45-60 minutes per round',
      process: [
        'Recruiter screen — role and team specific fit',
        'Technical phone screen (45-60 min) — coding + domain knowledge',
        'Onsite Interview Day (5-6 rounds, team-specific):',
        '  - Round 1: Coding/DSA (45-60 min)',
        '  - Round 2: Coding/DSA or domain-specific (45-60 min)',
        '  - Round 3: System Design or LLD (60 min)',
        '  - Round 4: Team collaboration / behavioral (45 min)',
        '  - Round 5: Hiring Manager round (45 min)',
        '  - Round 6 (optional): Cross-functional partner interview',
        'All interviewers debrief together',
        'Hiring manager makes final call with team consensus'
      ],
      teamSpecific: `Unlike Google (committee) or Meta (bootcamp), Apple interviews are highly team-specific. You interview for a specific team and role. Your interviewers are people you'll actually work with. This means domain knowledge for that team matters a lot.`
    },

    dsa: {
      interviewerStyle: `Apple DSA interviews balance algorithm knowledge with practical engineering sense. They may give you problems inspired by real Apple engineering challenges. They care about code quality, edge cases, and whether your solution would work in a real product. Apple interviewers tend to be detail-oriented — they'll notice if you handle error cases.`,
      
      expectations: [
        'Write high-quality, production-ready code',
        'Handle all edge cases — Apple engineers sweat the details',
        'Consider memory and performance — think about running on actual devices',
        'Clean, readable code with proper error handling',
        'Discuss approach before coding',
        'Consider real-world constraints (battery, memory, network)',
        'Test your code thoroughly',
        'Show attention to detail in your implementation'
      ],

      commonTopics: [
        'Arrays and strings (especially with Unicode/international text)',
        'Trees and graphs',
        'Dynamic programming',
        'Concurrency and threading problems',
        'Memory management considerations',
        'Performance-critical algorithms',
        'Data structures for real-time systems',
        'Platform-specific optimizations'
      ]
    },

    hld: {
      interviewerStyle: `Apple system design reflects their product-focused culture. You might be asked to design systems that Apple actually builds — iCloud, iMessage, App Store backend. They care about user experience, privacy, device integration, and end-to-end reliability. "What does the user see if this component fails?" is a very Apple question.`,
      
      expectations: [
        'Think about end-to-end user experience',
        'Privacy as a core design constraint',
        'Consider device constraints (battery, memory, network)',
        'Design for offline-first where appropriate',
        'Sync across devices seamlessly (Apple ecosystem)',
        'End-to-end encryption where applicable',
        'Think about app launch time and responsiveness',
        'Consider accessibility in system design',
        'Design for graceful degradation on older devices',
        'Think about international users and localization'
      ]
    },

    lld: {
      interviewerStyle: `Apple LLD interviews focus on clean design, attention to detail, and craftsmanship. They want to see elegant, well-thought-out class hierarchies that handle edge cases gracefully.`,
      
      expectations: [
        'Elegant, clean design — every class has a clear purpose',
        'Strong encapsulation and information hiding',
        'Consider thread safety — Apple is multi-threaded by nature',
        'Error handling is thorough and graceful',
        'Design for testability',
        'Consider performance implications of design choices',
        'Think about memory management',
        'Clean API surface — minimal and intuitive'
      ]
    },

    behavioral: {
      interviewerStyle: `Apple behavioral rounds focus on team fit, collaboration, and passion for building great products. They want to know if you'll elevate the team, handle Apple's demanding pace, and care about details.`,
      
      expectations: [
        'Show passion for building great products',
        'Demonstrate attention to detail in your work',
        'Show collaboration within tight-knit teams',
        'Handle ambiguity while maintaining quality standards',
        'Show how you balance speed with craftsmanship',
        'Demonstrate user empathy — how do users experience your work?',
        'Show you can handle feedback and iterate',
        'Team-first mentality — how you make others better'
      ]
    },

    scoring: {
      scale: 'Apple uses team consensus with hiring manager decision',
      hiringBar: `Apple's bar is craftsmanship-focused. They'd rather reject a good candidate than hire someone who doesn't sweat the details. Team fit matters enormously since you'll work closely with your interviewers.`,
      evaluationTone: 'Detail-oriented, craft-focused, user-experience driven. Apple cares about the quality of your work, your attention to detail, and whether you\'d elevate the team\'s output.'
    },

    persona: {
      name: 'James',
      title: 'Engineering Manager, Apple Platform Technologies',
      style: 'Detail-oriented, quality-focused, thoughtful. Will probe edge cases. Values craftsmanship.',
      introduction: `Hello, I'm James — Engineering Manager on the Platform Technologies team. Today we'll explore a problem together. I'm interested in how you think about building quality software — not just whether you can solve a problem, but how well you solve it. I'll be looking at your attention to detail, how you handle edge cases, and the overall quality of your code. Take your time to think, and let me know your approach before you start coding.`
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // NETFLIX
  // ═══════════════════════════════════════════════════════════════════
  netflix: {
    name: 'Netflix',
    displayName: 'Netflix',
    color: '#E50914',
    logo: '🔴',

    culture: {
      summary: `Netflix's culture is defined by "Freedom and Responsibility." They hire senior, self-directed engineers and give them enormous autonomy. There are no vacation policies, no expense policies — they trust adults to make good decisions. Netflix expects you to operate like a senior leader from day one. Their famous Culture Deck is the foundation of everything. Netflix interviews for senior-level thinking regardless of title.`,
      
      coreValues: [
        'People over Process — great people make great judgment calls',
        'Freedom and Responsibility — autonomy with accountability',
        'Highly Aligned, Loosely Coupled — clear context, independent execution',
        'Pay Top of Market — they want the best and pay for it',
        'The Keeper Test — would your manager fight to keep you?',
        'No Brilliant Jerks — talent alone isn\'t enough',
        'Radical Candor — honest, direct feedback is a gift',
        'Context, Not Control — leaders provide context, not orders',
        'Disagree then Commit — healthy debate, then unified execution'
      ],

      engineeringPrinciples: [
        'Build for resilience — Chaos Engineering (they invented it)',
        'Microservices architecture at massive scale',
        'Data-driven everything — A/B test all decisions',
        'Performance and availability are existential (streaming can\'t buffer)',
        'Innovation in open source (Zuul, Eureka, Hystrix, Chaos Monkey)',
        'Think about the global streaming experience',
        'Build systems that handle failure gracefully (Chaos Monkey philosophy)',
        'JVM ecosystem expertise (Java, Spring Boot) is valued',
        'Content delivery and video encoding expertise',
        'ML/Personalization is core to the product'
      ]
    },

    interviewStructure: {
      totalRounds: '5-6 rounds (phone + onsite)',
      duration: '45-60 minutes per round',
      process: [
        'Recruiter/Hiring Manager screen — culture fit and role expectations',
        'Technical phone screen (60 min) — deep technical discussion + coding',
        'Onsite (Virtual or In-person, all senior-level discussions):',
        '  - Round 1: Coding/DSA (60 min) — production-quality expected',
        '  - Round 2: System Design (60 min) — focus on distributed systems',
        '  - Round 3: Past Experience Deep Dive (60 min) — your biggest projects',
        '  - Round 4: Culture/Values Interview (60 min) — Netflix culture fit',
        '  - Round 5: Hiring Manager Final (45 min)',
        'All interviewers provide independent feedback',
        'Hiring manager makes final call'
      ],
      uniqueAspects: `Netflix interviews are unique because they treat every candidate as a senior hire. There's no "entry-level" track at Netflix — they expect seasoned engineers. The "Past Experience Deep Dive" round is special — it's 60 minutes of drilling into your most impactful projects.`
    },

    dsa: {
      interviewerStyle: `Netflix DSA interviews are practical and production-focused. They don't ask LeetCode-style puzzles as much — they prefer problems that reflect real engineering challenges. They expect production-quality code with proper error handling, testing, and documentation. Think of it as writing code that would ship to production, not code that passes test cases.`,
      
      expectations: [
        'Production-quality code — not interview-quality',
        'Proper error handling and input validation',
        'Consider concurrency and thread safety',
        'Clean code with documentation where needed',
        'Discuss architecture and design decisions in your code',
        'Think about testing — how would you test this?',
        'Performance matters — Netflix streams to 260M+ subscribers',
        'Show senior engineering judgment',
        'Discuss operational considerations — monitoring, logging, alerting',
        'Java/JVM ecosystem knowledge is a plus'
      ],

      commonTopics: [
        'Distributed systems algorithms',
        'Concurrent programming and thread safety',
        'Cache design and eviction strategies',
        'Rate limiting and circuit breakers',
        'Data structures for streaming/real-time systems',
        'Graph algorithms (recommendation graphs)',
        'String processing and content matching',
        'Performance optimization problems'
      ]
    },

    hld: {
      interviewerStyle: `Netflix system design interviews go deep into distributed systems, resilience, and streaming infrastructure. They want to see chaos engineering thinking — "what happens when your primary database goes down?" They expect you to design for failure and know about patterns like circuit breakers, bulkheads, and graceful degradation. Netflix invented many of these patterns.`,
      
      expectations: [
        'Chaos engineering mindset — design for failure',
        'Circuit breaker pattern (Hystrix)',
        'Service mesh and API gateway design (Zuul)',
        'Microservices architecture at scale',
        'Content delivery network design',
        'Video encoding and adaptive bitrate streaming',
        'Recommendation engine architecture (ML pipeline)',
        'A/B testing infrastructure at scale',
        'Global deployment and multi-region architecture',
        'Cache hierarchies (EVCache, Memcached)',
        'Event-driven architecture with Apache Kafka',
        'Data pipeline design for analytics'
      ],

      commonTopics: [
        'Design Netflix Video Streaming Pipeline',
        'Design a Recommendation Engine',
        'Design a Content Delivery Network',
        'Design Netflix\'s A/B Testing Platform',
        'Design a Video Encoding Pipeline',
        'Design a Global Load Balancer',
        'Design a Rate Limiter (Zuul-style)',
        'Design Netflix\'s Personalization Engine',
        'Design a Chaos Engineering Platform',
        'Design a Global Config Service'
      ]
    },

    lld: {
      interviewerStyle: `Netflix LLD rounds (less common) expect senior-level design thinking. Clean architecture, proper abstractions, and resilience patterns. They want to see code that could ship to production.`,
      
      expectations: [
        'Clean, production-ready architecture',
        'Resilience patterns (circuit breaker, retry, fallback)',
        'Proper abstraction layers',
        'Thread safety and concurrent design',
        'Consider operational aspects in your design',
        'Write code with proper error handling',
        'Design for observability (logging, metrics, tracing)',
        'Consider backward compatibility and versioning'
      ]
    },

    behavioral: {
      interviewerStyle: `Netflix behavioral interviews are intense. They're evaluating you against the Netflix Culture Deck — Freedom & Responsibility, Radical Candor, the Keeper Test. They want specific examples of you operating at a senior level: making difficult decisions, giving hard feedback, taking ownership of failures, and driving outsized impact. This is NOT a "tell me about a time" session — it's a deep conversation about how you operate as a professional.`,
      
      expectations: [
        'Demonstrate "Freedom and Responsibility" — autonomy with accountability',
        'Show Radical Candor — giving and receiving honest feedback',
        'Demonstrate the "Keeper Test" — would your manager fight to keep you?',
        'Show senior judgment — making difficult decisions with incomplete information',
        'Impact at scale — what changed because of YOU?',
        'Show "Context, Not Control" — how you lead through context',
        'Demonstrate "Disagree then Commit"',
        'Show you\'re a "stunning colleague" — not a brilliant jerk',
        'Discuss compensation and growth expectations openly (Netflix values transparency)'
      ]
    },

    scoring: {
      scale: 'Netflix uses: Strong Hire, Hire, No Hire (no middle ground — they\'re decisive)',
      hiringBar: `Netflix's bar is arguably the highest because they expect EVERY hire to operate at a senior level. They pay top of market and expect top of market performance. There's no "lean hire" — you're either clearly worth it or you're not.`,
      evaluationTone: 'Senior-level, impact-focused, culture-fit driven. Netflix evaluates you as if you\'re already a senior engineer. They care about judgment, impact, and whether you embody their culture of freedom and responsibility.'
    },

    persona: {
      name: 'Jordan',
      title: 'Senior Software Engineer, Netflix Content Engineering',
      style: 'Direct, senior-level, expects autonomy. Values candor and judgment. Will challenge your decisions.',
      introduction: `Hi, I'm Jordan — Senior Engineer on the Content Engineering team at Netflix. I'll be your interviewer today. I want this to feel like a conversation between two engineers working on a hard problem. I'm going to ask you some questions, and I want to see how you think, how you communicate your reasoning, and the quality of your engineering judgment. At Netflix, we value candor — so I'll be direct with my feedback, and I hope you'll be direct with me too. Ready?`
    }
  }
};

/**
 * Get full company context for a specific company
 */
function getCompanyContext(company) {
  return COMPANY_CONTEXTS[company.toLowerCase()] || null;
}

/**
 * Get all available companies
 */
function getAvailableCompanies() {
  return Object.keys(COMPANY_CONTEXTS).map(key => ({
    id: key,
    name: COMPANY_CONTEXTS[key].name,
    displayName: COMPANY_CONTEXTS[key].displayName,
    color: COMPANY_CONTEXTS[key].color,
    logo: COMPANY_CONTEXTS[key].logo
  }));
}

/**
 * Get interviewer persona for a specific company
 */
function getInterviewerPersona(company) {
  const ctx = COMPANY_CONTEXTS[company.toLowerCase()];
  return ctx ? ctx.persona : null;
}

/**
 * Get round-specific context for a company
 */
function getRoundContext(company, roundType) {
  const ctx = COMPANY_CONTEXTS[company.toLowerCase()];
  if (!ctx) return null;
  return ctx[roundType] || null;
}

/**
 * Get company scoring criteria
 */
function getScoringContext(company) {
  const ctx = COMPANY_CONTEXTS[company.toLowerCase()];
  return ctx ? ctx.scoring : null;
}

module.exports = {
  COMPANY_CONTEXTS,
  getCompanyContext,
  getAvailableCompanies,
  getInterviewerPersona,
  getRoundContext,
  getScoringContext
};
