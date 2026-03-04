/**
 * HireSense AI — Deep Question Intelligence
 * 
 * This module provides the CRITICAL context that makes HireSense different
 * from generic LLM wrappers. It contains:
 * 
 * 1. Per-company topic frequency distributions (what they ACTUALLY ask)
 * 2. Question philosophy (WHY they ask what they ask)
 * 3. Company-specific probing patterns (HOW they follow up)
 * 4. Difficulty calibration per company
 * 5. Company-specific evaluation anchors for each topic
 * 6. Real interview patterns and anti-patterns
 * 
 * This context is injected into every LLM prompt so the AI interviewer
 * behaves differently for each company — not just in tone, but in what
 * it asks, how deep it goes, and what it rewards.
 */

const QUESTION_INTELLIGENCE = {

  // ═══════════════════════════════════════════════════════════════════
  // GOOGLE — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  google: {
    dsa: {
      philosophy: `Google uses DSA interviews to evaluate THINKING PROCESS, not memorization. They prefer novel problems or twists on classic problems so pattern-matching doesn't work. Google interviewers care more about HOW you arrive at the solution than whether you get it. A candidate who clearly explains a brute-force approach and methodically optimizes it will score higher than someone who jumps to the optimal solution without explaining why it works. Google explicitly trains interviewers to evaluate "thought process" as a separate signal.`,

      topicDistribution: {
        'graphs-and-trees': { frequency: '30-35%', notes: 'Google loves graph problems — BFS, DFS, topological sort, shortest path. Trees are especially common: BST operations, tree traversals, LCA. Google builds products (Maps, Search, Knowledge Graph) that are fundamentally graph problems.' },
        'dynamic-programming': { frequency: '15-20%', notes: 'DP appears frequently at Google but they care about the DERIVATION — can you identify the recurrence relation? They often give problems where greedy ALMOST works but DP is needed, testing if you can prove correctness.' },
        'arrays-and-strings': { frequency: '20-25%', notes: 'Sliding window, two pointers, prefix sums. Google often adds twists: "What if the array is too large to fit in memory?" or "What if elements are streaming?"' },
        'binary-search': { frequency: '10-15%', notes: 'Google loves binary search on answer space (not just sorted arrays). They test if you can identify when binary search applies to non-obvious problems.' },
        'hash-maps-and-sets': { frequency: '10-15%', notes: 'Often combined with other techniques. Google tests hash map design decisions: collision handling, load factor, when to use vs. when NOT to use.' },
        'tries-and-advanced': { frequency: '5-10%', notes: 'Tries for autocomplete (Google Search), union-find for connected components, segment trees for range queries. These appear more at L5+ interviews.' }
      },

      probingPatterns: [
        { trigger: 'Candidate gives brute force', response: 'Ask: "What\'s the bottleneck? Can you identify which step is the most expensive and think about how to speed it up?"' },
        { trigger: 'Candidate gives optimal', response: 'Don\'t congratulate. Ask: "Can you prove this is optimal? What\'s the lower bound for this problem? Walk me through your code with this edge case: [empty input / single element / all duplicates]."' },
        { trigger: 'Candidate is silent > 30 sec', response: 'Say: "I\'d love to hear what you\'re thinking, even if it\'s not fully formed. What approaches have you considered so far?"' },
        { trigger: 'Candidate codes without discussing', response: 'Interrupt: "Before you start coding — can you walk me through your approach first? I want to make sure we\'re aligned on the strategy."' },
        { trigger: 'Candidate gives correct answer fast', response: 'ESCALATE: "Great start. Now, what if [add constraint]? What if the input doesn\'t fit in memory? What if we need to handle concurrent updates?"' },
        { trigger: 'Candidate makes wrong complexity claim', response: 'Challenge: "Are you sure that\'s O(n)? Can you trace through the worst case for me? What happens when [worst case input]?"' }
      ],

      difficultyCalibration: {
        L3: 'One medium problem, solved completely with clean code. Follow-up is a minor extension.',
        L4: 'One medium-hard problem. Must optimize beyond brute force. Follow-up adds a significant constraint.',
        L5: 'One hard problem OR medium + hard follow-up. Must demonstrate algorithmic maturity and handle edge cases without prompting.',
        L6: 'Hard problem with system-level thinking. "How would you parallelize this?" "What if this runs on distributed systems?"'
      },

      whatMakesGoogleDSAUnique: `Google interviewers use Google Docs or a shared editor (no IDE, no autocomplete, no syntax highlighting in many cases). This means code quality is evaluated differently — you need to write clean code WITHOUT IDE help. Google also allows interviewers to give personalized problems, so you might get a question you've never seen before. The follow-up culture is strong: solve one problem, immediately get a harder extension.`
    },

    hld: {
      philosophy: `Google system design interviews test if you can think at Google scale — BILLIONS of users, petabytes of data, 99.999% uptime. Google invented many foundational distributed systems (MapReduce, Bigtable, Spanner, Borg) so interviewers expect you to understand these concepts even if you don't name-drop. They care deeply about data modeling, consistency guarantees, and back-of-the-envelope math. A Google SDI is less about drawing boxes and more about proving you understand WHY each component exists.`,

      topicDistribution: {
        'search-and-indexing': { frequency: '15-20%', notes: 'Web crawler, search engine, autocomplete. Google wants to see inverted index knowledge, ranking algorithms, crawl prioritization.' },
        'real-time-collaboration': { frequency: '10-15%', notes: 'Google Docs-style real-time editing. Tests CRDT knowledge, operational transforms, conflict resolution.' },
        'video-and-media': { frequency: '10-15%', notes: 'YouTube-scale video upload, encoding, streaming. Tests understanding of CDN, adaptive bitrate, encoding pipeline.' },
        'messaging-and-notifications': { frequency: '15-20%', notes: 'Chat systems, notification fanout. Tests pub/sub, message queuing, presence systems.' },
        'storage-and-data': { frequency: '15-20%', notes: 'Cloud storage (Google Drive), database design. Tests sharding, replication, consistency models.' },
        'maps-and-location': { frequency: '10%', notes: 'Location services, route optimization. Tests spatial indexing (geohash, quadtree), graph algorithms at scale.' },
        'infrastructure': { frequency: '10-15%', notes: 'Rate limiter, load balancer, config service. Tests understanding of infrastructure primitives.' }
      },

      probingPatterns: [
        { trigger: 'Candidate draws high-level boxes', response: '"Let\'s go deeper on [component]. What data structure does it use internally? What happens when it receives 100K requests per second?"' },
        { trigger: 'Candidate says "use a cache"', response: '"What kind of cache? Where in the stack? What\'s the eviction policy? How do you handle cache invalidation? What\'s the hit rate you\'re targeting?"' },
        { trigger: 'Candidate picks a database', response: '"Why this database over alternatives? What are the consistency guarantees? How do you shard it? What\'s the replication strategy?"' },
        { trigger: 'Design seems complete', response: '"What\'s the weakest point in your design? If you had another week to improve it, what would you change? What happens during a datacenter outage?"' }
      ],

      companySpecificSystems: [
        'Design Google Search (web crawler + indexing + ranking)',
        'Design Google Maps (routing + location + real-time traffic)',
        'Design Google Docs (real-time collaboration + OT/CRDT)',
        'Design YouTube (video upload + encoding + streaming + recommendations)',
        'Design Google Drive (file storage + sync + sharing)',
        'Design Gmail (email delivery + search + spam filtering)',
        'Design Google Photos (storage + ML-based search + sharing)',
        'Design Google Translate (ML pipeline + serving + caching)'
      ]
    },

    lld: {
      philosophy: `Google LLD interviews focus on clean abstractions and testability. Google uses extensive code review culture, so your design must be something a team could review, understand, and extend. They value interface design over implementation details — "What's the contract between these two components?"`,

      companySpecificProblems: [
        'Design a File System API (think Google Drive\'s internal API)',
        'Design a Task Queue with priorities and retries',
        'Design an online chess/board game (clean state machine)',
        'Design a key-value store with TTL support',
        'Design a rate limiter class library',
        'Design a logging framework with pluggable outputs'
      ]
    },

    behavioral: {
      philosophy: `Google's "Googleyness and Leadership" (GnL) round is NOT about leadership titles. It's about: (1) How you handle ambiguity without getting paralyzed. (2) How you influence without authority. (3) How you learn from mistakes (intellectual humility). (4) Whether you'd be someone others enjoy working with. Google specifically looks for "comfort with ambiguity" because most Google projects don't have clear requirements.`,

      uniquePatterns: [
        'Will ask "Tell me about a time things were ambiguous" — Google operates in ambiguity constantly',
        'Probes for intellectual humility: "Tell me about a time you were wrong"',
        'Tests collaboration: "How did you bring others along?" (not hero stories)',
        'Looks for ethical reasoning: "Tell me about a difficult ethical choice at work"',
        'Values learning: "What did you learn?" is always a follow-up'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // AMAZON — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  amazon: {
    dsa: {
      philosophy: `Amazon DSA interviews are PRACTICAL and FAST. They want working code that handles edge cases. Every DSA round at Amazon also includes 15-20 minutes of behavioral questions mapped to Leadership Principles — so you're solving a coding problem AND telling LP stories in the same 60 minutes. Amazon interviewers evaluate "Bias for Action" even in coding — they want to see you start with a working solution quickly, then optimize. Spending 20 minutes thinking in silence violates "Bias for Action."`,

      topicDistribution: {
        'graphs-bfs-dfs': { frequency: '25-30%', notes: 'Amazon LOVES graph problems — Number of Islands, Rotting Oranges, course schedule. This maps to their logistics/delivery/network problems internally. BFS is particularly common because it models real Amazon systems (warehouse routing, delivery optimization).' },
        'trees': { frequency: '15-20%', notes: 'BST operations, serialization, LCA. Amazon asks tree problems because their internal systems use tree structures (product categorization, organizational hierarchy).' },
        'arrays-and-hashing': { frequency: '20-25%', notes: 'Two sum variants, subarray problems, sliding window. Amazon OA (online assessment) heavily features array problems.' },
        'heaps-and-sorting': { frequency: '10-15%', notes: 'Top K problems, merge K sorted lists, meeting rooms. These map to Amazon\'s ranking and scheduling systems.' },
        'dynamic-programming': { frequency: '10-15%', notes: 'Medium-level DP. Amazon rarely asks hard DP in on-site (saves that for Google). Focus is on recognizing DP patterns, not mathematical proofs.' },
        'design-problems': { frequency: '5-10%', notes: 'LRU Cache, design HashMap. Amazon blends coding with design — "implement this data structure from scratch."' }
      },

      probingPatterns: [
        { trigger: 'Any point during interview', response: 'Amazon interviewers WILL ask: "Tell me about a time when..." mid-coding. Be ready to context-switch between coding and behavioral.' },
        { trigger: 'Candidate gives solution', response: 'Ask: "Is this production-ready? What if this code ran on millions of items? How would you test this? What monitoring would you add?"' },
        { trigger: 'Candidate optimizes', response: '"Good. Now tell me about a time you had to optimize something in a real project. What LP does that demonstrate? (Insist on Highest Standards / Dive Deep)"' },
        { trigger: 'Candidate handles edge case', response: '"What about [another edge case]? Also, this reminds me — tell me about a time you caught a bug in production that others missed." (Dive Deep LP)' },
        { trigger: 'Code is messy', response: '"This works, but would you be comfortable shipping this to production? What would a code reviewer say? How does this reflect Insist on Highest Standards?"' }
      ],

      oaPatterns: `Amazon's Online Assessment (OA) is the first technical filter. It typically includes 2 coding problems (70 min) plus a "Work Simulation" behavioral assessment. OA problems are usually medium-level array/graph problems. Candidates who pass OA proceed to the on-site loop. The OA topics heavily favor: arrays, strings, graphs (BFS/DFS), and sorting.`,

      whatMakesAmazonDSAUnique: `Amazon is the ONLY top tech company that mixes behavioral questions INTO coding rounds. You'll be solving a medium graph problem, and then the interviewer will say "Great — now tell me about a time you disagreed with a teammate." This tests your ability to context-switch and your LP alignment simultaneously. Also, Amazon's Bar Raiser can ask ANY type of question — coding, design, or behavioral — regardless of which round they're assigned to.`
    },

    hld: {
      philosophy: `Amazon system design interviews think in MICROSERVICES. Amazon pioneered SOA (Service-Oriented Architecture) — everything at Amazon is a service. They want to see you decompose a system into independently deployable services that communicate through well-defined APIs. They care deeply about OPERATIONAL EXCELLENCE: "You build it, you run it." Your design must include monitoring, alerting, and failure handling. Cost awareness (Frugality LP) is also evaluated — don't design a $10M system when a $100K one works.`,

      topicDistribution: {
        'e-commerce': { frequency: '25-30%', notes: 'Product catalog, order processing, inventory management, shopping cart. These are Amazon\'s bread-and-butter systems. Interviewers know these intimately and will probe deep.' },
        'logistics-and-delivery': { frequency: '15-20%', notes: 'Delivery routing, warehouse management, fleet tracking. Amazon is fundamentally a logistics company — these questions test real Amazon engineering.' },
        'streaming-and-media': { frequency: '10-15%', notes: 'Prime Video, Twitch-style streaming. Tests CDN understanding, adaptive bitrate, content delivery.' },
        'recommendation-and-search': { frequency: '10-15%', notes: 'Product recommendations, search ranking. Tests ML pipeline design, A/B testing infrastructure.' },
        'infrastructure': { frequency: '15-20%', notes: 'Design S3, design SQS, design a load balancer. Amazon Web Services is Amazon — they want to see if you understand cloud primitives.' },
        'notification-and-messaging': { frequency: '10-15%', notes: 'Push notifications, email service, SNS-style pub/sub. Tests event-driven architecture understanding.' }
      },

      awsAwareness: `Amazon interviewers expect you to know AWS services, even if you don't use them as your solution. Mentioning "I'd use DynamoDB here because of its single-digit millisecond latency and auto-scaling" shows awareness. Key services to know: DynamoDB, S3, SQS, SNS, Lambda, API Gateway, ElastiCache, RDS/Aurora, CloudFront, Route 53, ECS/EKS.`,

      companySpecificSystems: [
        'Design Amazon.com product page (catalog + pricing + reviews + recommendations)',
        'Design Amazon Order Processing Pipeline (order → payment → inventory → shipping)',
        'Design Amazon Prime Delivery Routing (logistics optimization)',
        'Design Amazon S3 (distributed object storage)',
        'Design Amazon SQS (distributed message queue)',
        'Design Alexa Voice Service (speech → intent → response)',
        'Design Amazon Recommendation Engine (collaborative filtering + real-time)',
        'Design Amazon Warehouse Management System'
      ],

      probingPatterns: [
        { trigger: 'Candidate designs system', response: '"You build it, you run it. How would you monitor this? What metrics? What alarms? What\'s your on-call runbook look like?"' },
        { trigger: 'Candidate picks a technology', response: '"What\'s the cost of running this? Is there a more frugal option? How does this scale with usage — what\'s the cost curve?"' },
        { trigger: 'Design handles happy path', response: '"What happens on Prime Day when traffic is 10x normal? What\'s your scaling strategy? How quickly can you scale up and down?"' },
        { trigger: 'Candidate finishes design', response: '"Walk me through a customer order end-to-end. Where could the customer have a bad experience? How do you prevent that?" (Customer Obsession LP)' }
      ]
    },

    lld: {
      philosophy: `Amazon LLD interviews are practical — design something you'd actually build at Amazon. They want to see clear ownership boundaries (each class owns one thing), proper error handling (Amazon systems handle millions of edge cases), and testability.`,

      companySpecificProblems: [
        'Design an Amazon Locker System (package delivery + pickup + expiry)',
        'Design a Vending Machine state machine',
        'Design an Order Management System (state transitions)',
        'Design a Coupon/Discount Engine with composable rules',
        'Design a Notification Preference System (channels + throttling)',
        'Design a Warehouse Slot Allocation System'
      ]
    },

    behavioral: {
      philosophy: `Amazon behavioral interviews are the MOST structured in big tech. Every single question maps to a specific Leadership Principle. The interviewer has a scorecard with specific LPs they must evaluate. STAR format is MANDATORY — interviewers are trained to probe until they get Situation, Task, Action, and Result with DATA. "We improved performance" is NOT acceptable — "We reduced p99 latency from 200ms to 45ms, a 78% improvement" IS. The Bar Raiser specifically evaluates LP breadth — do you demonstrate multiple LPs naturally?`,

      lpMappingToQuestions: {
        'Customer Obsession': 'Tell me about a time you went above and beyond for a customer/user.',
        'Ownership': 'Tell me about a time you took on something outside your area of responsibility.',
        'Invent and Simplify': 'Tell me about a time you simplified a complex process.',
        'Are Right, A Lot': 'Tell me about a time you made a decision with incomplete data.',
        'Learn and Be Curious': 'Tell me about something new you learned recently on your own.',
        'Hire and Develop the Best': 'Tell me about a time you mentored someone.',
        'Insist on the Highest Standards': 'Tell me about a time you refused to accept a shortcut.',
        'Think Big': 'Tell me about an innovative idea you proposed.',
        'Bias for Action': 'Tell me about a time you took a calculated risk.',
        'Frugality': 'Tell me about a time you accomplished something with limited resources.',
        'Earn Trust': 'Tell me about a time you had to deliver bad news to a stakeholder.',
        'Dive Deep': 'Tell me about a time you had to dig into data to find the root cause.',
        'Have Backbone; Disagree and Commit': 'Tell me about a time you disagreed with your manager.',
        'Deliver Results': 'Tell me about a time you delivered a project under a tight deadline.'
      },

      uniquePatterns: [
        'ALWAYS maps to specific LP — interviewer will ask "Which LP does this demonstrate?"',
        'Demands data: "What was the metric impact? Give me a number."',
        'Probes ownership: "What was YOUR specific contribution? Not the team\'s."',
        'Tests Disagree and Commit: "Did you ever disagree? What happened after you committed?"',
        'Bar Raiser asks the hardest behavioral questions and has veto power'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // META — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  meta: {
    dsa: {
      philosophy: `Meta DSA interviews are the FASTEST in big tech. You get 2 problems in 45 minutes — roughly 20 minutes per problem including discussion. There is NO time for extended exploration. Meta wants engineers who can identify patterns QUICKLY, code CORRECTLY on the first attempt, and move on. If you spend 15 minutes on problem 1, you've already failed problem 2. Meta interviewers don't give hints freely — they expect proficiency. The difficulty usually ramps: problem 1 is medium, problem 2 is medium-hard to hard.`,

      topicDistribution: {
        'arrays-and-strings': { frequency: '30-35%', notes: 'The MOST common category at Meta. Two pointers, sliding window, prefix sums, in-place operations. Meta asks these because they test speed — fast candidates solve array problems quickly.' },
        'trees-and-graphs': { frequency: '20-25%', notes: 'Binary tree traversals (BFS, DFS, level-order), graph traversals. The social graph IS Meta — they want engineers who think in graphs. LCA, right-side view, and serialize/deserialize are Meta classics.' },
        'binary-search': { frequency: '10-15%', notes: 'Random Pick with Weight, search in rotated array. Meta tests if you can apply binary search to non-obvious problems.' },
        'hash-maps': { frequency: '15-20%', notes: 'Subarray sum, two sum variants, frequency counting. Hash maps enable O(1) lookups which Meta needs for real-time systems.' },
        'intervals': { frequency: '5-10%', notes: 'Merge intervals, meeting rooms. These appear because Meta schedules billions of events (ad delivery, content ranking).' },
        'dynamic-programming': { frequency: '5-10%', notes: 'LESS common than at Google. When DP appears at Meta, it\'s usually medium difficulty. Meta prefers problems that test implementation speed over mathematical depth.' }
      },

      probingPatterns: [
        { trigger: 'Candidate solves problem 1', response: 'Move immediately: "Good. Here\'s problem 2." No extended discussion. Time is the constraint.' },
        { trigger: 'Candidate is slow on problem 1', response: '"Let\'s move on to the next problem — you can come back if there\'s time." (There won\'t be.)' },
        { trigger: 'Candidate asks many clarifications', response: '"The problem statement is complete. What approach are you thinking?" (Meta values speed, not excessive clarification)' },
        { trigger: 'Candidate gives suboptimal solution', response: '"That works. What\'s the complexity? Can you do better?" Keep it brief — move to next problem.' },
        { trigger: 'Both problems solved', response: 'If time remains: "What if the input size was 10^9?" or "What if this had to run in real-time?"' }
      ],

      twoProblemsFormat: `Meta is unique in asking 2 problems per round. Problem 1 is typically a warm-up (easy-medium). Problem 2 is the actual evaluation (medium-hard). Some interviewers give a medium Problem 1 and if you solve it fast, give a hard Problem 2. Your score is based on BOTH problems — solving one perfectly but failing the other is usually a "Lean No Hire."`,

      whatMakesMetaDSAUnique: `Speed is Meta's differentiator. They believe fast problem-solving correlates with fast shipping — and "Move Fast" is Meta's core value. Meta also uses CoderPad (shared IDE) rather than Google Docs, so you have syntax highlighting and can run code. This means your code must ACTUALLY work — you can't hand-wave bugs.`
    },

    hld: {
      philosophy: `Meta system design is PRODUCT-FOCUSED. They'll ask you to design something Meta actually builds — News Feed, Messenger, Instagram Stories. They expect you to understand the product implications of your technical choices. "How does this affect the user experience?" is a common Meta SDI question. They think at massive scale (3B+ MAU) and care deeply about mobile performance (most Meta users are on mobile, many on 2G/3G connections in emerging markets).`,

      topicDistribution: {
        'social-feed': { frequency: '25-30%', notes: 'News Feed ranking, content delivery, real-time updates. This is Meta\'s core product — interviewers know it intimately. Must discuss fan-out strategies, ranking algorithms, and real-time push.' },
        'messaging': { frequency: '20-25%', notes: 'WhatsApp, Messenger, Instagram DMs. Tests real-time message delivery, end-to-end encryption, offline message queuing, group messaging at scale.' },
        'media-and-content': { frequency: '15-20%', notes: 'Instagram Stories, Reels, photo upload/storage. Tests media processing pipelines, CDN, adaptive quality based on network.' },
        'social-graph': { frequency: '10-15%', notes: 'Friend recommendations, mutual friends, social network traversal. Tests graph databases, graph algorithms at billion-user scale.' },
        'ads-and-ranking': { frequency: '10-15%', notes: 'Ad delivery, auction system, content ranking. Tests ML serving infrastructure, real-time bidding, A/B testing.' },
        'notifications': { frequency: '5-10%', notes: 'Push notification system, in-app notifications. Tests notification aggregation, user preference management, delivery guarantees.' }
      },

      companySpecificSystems: [
        'Design Facebook News Feed (ranking + fan-out + real-time)',
        'Design Instagram Stories (ephemeral content + ordering + viewers)',
        'Design WhatsApp (E2E encryption + message delivery + group chat)',
        'Design Facebook Messenger (real-time + presence + media)',
        'Design Instagram Explore (content discovery + ML ranking)',
        'Design Facebook Marketplace (listings + search + messaging)',
        'Design Facebook Live (live streaming + comments + reactions)',
        'Design Meta Ad Auction System (bidding + targeting + serving)'
      ],

      probingPatterns: [
        { trigger: 'Candidate designs system', response: '"How does this work on a 2G connection in rural India? Most of our users aren\'t on fast networks." (Product awareness)' },
        { trigger: 'Candidate picks architecture', response: '"How do you A/B test changes to this? Meta runs thousands of experiments simultaneously."' },
        { trigger: 'Data model designed', response: '"How do you handle content moderation? What happens when a post violates community standards?"' },
        { trigger: 'System handles reads', response: '"What\'s the write path? When a user with 5000 friends posts, how does it reach all of them? Fan-out on write vs. fan-out on read?"' }
      ]
    },

    lld: {
      philosophy: `Meta LLD rounds (less common than DSA) emphasize pragmatic, shippable design. Don't over-engineer. Build the MVP that works, then discuss extensions.`,

      companySpecificProblems: [
        'Design a Social Event System (create/join/manage events)',
        'Design a Content Moderation Rules Engine',
        'Design a Privacy Settings System (granular access control)',
        'Design a Real-time Comment System',
        'Design a Friend Recommendation Engine class structure'
      ]
    },

    behavioral: {
      philosophy: `Meta behavioral rounds are shorter and less structured than Amazon's, but they probe for IMPACT and SPEED. Meta wants to know: What's the biggest thing you shipped? How fast did you ship it? What was the measurable impact? They care about "Why Meta?" — candidates who can articulate why Meta's mission (connecting people) resonates with them score higher. Meta also evaluates "Move Fast" — stories about long deliberation before acting are yellow flags.`,

      uniquePatterns: [
        'Focus on IMPACT: "What\'s the biggest impact you\'ve had? Give me the numbers."',
        'Tests speed: "How quickly did you ship this? What shortcuts did you take?"',
        'Product sense: "Why did you build it that way? How did users respond?"',
        'Asks "Why Meta?" — they want genuine product passion, not just a job',
        'Values cross-functional work: "How did you work with PM/Design?"'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // MICROSOFT — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  microsoft: {
    dsa: {
      philosophy: `Microsoft DSA interviews value CLARITY and COLLABORATION over raw speed. Unlike Meta (fast) or Google (deep), Microsoft wants to see if you can explain your thinking so clearly that any team member would understand. They often ask practical, real-world-flavored problems. Microsoft interviewers are typically more collaborative — they'll help guide you if you're stuck, but note whether you needed guidance. The "As Appropriate" (AA) interviewer can ask any type of question.`,

      topicDistribution: {
        'arrays-and-strings': { frequency: '25-30%', notes: 'Practical array/string problems. Microsoft may frame them as real scenarios: "Given a list of meeting times..." rather than abstract array operations.' },
        'linked-lists': { frequency: '10-15%', notes: 'Microsoft asks more linked list problems than other FAANG companies. Reverse, merge, detect cycle. These test pointer manipulation and careful coding.' },
        'trees': { frequency: '20-25%', notes: 'Binary trees, BSTs, n-ary trees. Microsoft builds products with hierarchical data (file systems, org charts, XML/JSON parsing).' },
        'graphs': { frequency: '10-15%', notes: 'BFS/DFS, connected components. Less emphasis on advanced graph algorithms compared to Google.' },
        'dynamic-programming': { frequency: '10-15%', notes: 'Medium DP. Microsoft prefers DP problems with clear real-world analogies (e.g., "minimum cost to reach the end").' },
        'design-and-implementation': { frequency: '10-15%', notes: 'Design data structures from scratch (implement a hash map, design an iterator). Tests understanding of what\'s "under the hood."' }
      },

      probingPatterns: [
        { trigger: 'Candidate gives approach', response: '"How would you explain this approach to a junior engineer on your team?" (Tests communication)' },
        { trigger: 'Candidate writes code', response: '"Walk me through this code line by line. What does this variable represent?" (Tests clarity)' },
        { trigger: 'Candidate makes a mistake', response: '"I think there might be an issue with that line — want to take another look?" (Collaborative, not confrontational)' },
        { trigger: 'Candidate solves problem', response: '"How would you test this? What test cases would you write? How would you convince a reviewer this code is correct?"' },
        { trigger: 'Good performance', response: '"How would this change if we needed it to work on multiple threads? How about if the input was Unicode?"' }
      ],

      whatMakesMicrosoftDSAUnique: `Microsoft interviewers are generally the most collaborative of the big tech companies. They'll give genuine hints (not just "think harder"), but they track how much help you needed. Also, the AA round (As Appropriate) is with a senior leader who can ask anything — coding, design, or behavioral — so you might get a surprise DSA question from a Director-level interviewer.`
    },

    hld: {
      philosophy: `Microsoft system design values PRACTICALITY, SECURITY, and ENTERPRISE features. Microsoft builds for enterprises — their systems must handle compliance (GDPR, HIPAA), multi-tenancy, and integration with existing enterprise infrastructure. They expect you to think about authentication (Azure AD), authorization (RBAC), and accessibility as first-class concerns, not afterthoughts.`,

      topicDistribution: {
        'collaboration': { frequency: '20-25%', notes: 'Teams, SharePoint, real-time collaboration. Microsoft is the enterprise collaboration leader. Tests WebRTC, real-time sync, multi-tenancy.' },
        'cloud-infrastructure': { frequency: '20-25%', notes: 'Azure services, storage, compute. Microsoft wants cloud-native thinking. Know Azure Cosmos DB, Azure Functions, Service Bus.' },
        'productivity': { frequency: '15-20%', notes: 'Office 365, Outlook, calendar systems. Tests enterprise workflow, sync across devices, offline support.' },
        'gaming': { frequency: '5-10%', notes: 'Xbox Live, game matchmaking, leaderboards. Tests real-time systems, low-latency design.' },
        'search-and-ai': { frequency: '10-15%', notes: 'Bing, Cortana, AI services. Tests search indexing, ML inference serving, conversational AI.' },
        'enterprise': { frequency: '15-20%', notes: 'Multi-tenant SaaS, compliance, audit logging. Tests enterprise architecture patterns unique to Microsoft.' }
      },

      companySpecificSystems: [
        'Design Microsoft Teams (video + chat + channels + enterprise)',
        'Design OneDrive / SharePoint (file sync + collaboration + enterprise)',
        'Design Outlook Calendar (scheduling + availability + rooms + time zones)',
        'Design Xbox Live Matchmaking (skill-based + low-latency + global)',
        'Design Azure DevOps Pipeline (CI/CD + artifacts + multi-tenant)',
        'Design Bing Search (web crawl + index + ranking + instant answers)',
        'Design Microsoft Authenticator (MFA + push + biometric)',
        'Design Power BI Dashboard Engine (data ingestion + visualization + sharing)'
      ],

      probingPatterns: [
        { trigger: 'Candidate designs system', response: '"How do you handle authentication? What about users in different Azure AD tenants? How does RBAC work?"' },
        { trigger: 'Data model designed', response: '"How do you handle GDPR? What if a user requests data deletion? What about audit logging for compliance?"' },
        { trigger: 'API designed', response: '"How do you version this API? What about backward compatibility? How do enterprise customers integrate with this?"' },
        { trigger: 'System complete', response: '"How would you make this accessible? What about screen readers? What about low-bandwidth users?"' }
      ]
    },

    lld: {
      philosophy: `Microsoft LLD values clean interfaces, testability, and cross-platform design. Think about how your design works on Windows, Mac, iOS, Android, and web.`,

      companySpecificProblems: [
        'Design a Document Editor (undo/redo + formatting + collaboration)',
        'Design a Plugin/Extension System (like VS Code extensions)',
        'Design a Calendar Scheduling System with conflict detection',
        'Design a Multi-tenant Permission System (RBAC)',
        'Design a File Sync Engine (conflict resolution + offline)',
        'Design a Test Runner Framework'
      ]
    },

    behavioral: {
      philosophy: `Microsoft behavioral rounds focus on Growth Mindset (Satya Nadella's cultural transformation). They want to hear about failures you LEARNED from, not just successes. "Tell me about a time you failed" is almost guaranteed. They evaluate inclusion and collaboration heavily — "Tell me about a time you helped someone who was different from you." The AA round with a Director+ is the most important behavioral evaluation.`,

      uniquePatterns: [
        'Growth Mindset is #1: "What did you learn from this failure?"',
        'Inclusion matters: "How do you make sure everyone is heard?"',
        'Collaboration over competition: "How did you help a struggling teammate?"',
        'Feedback culture: "How do you give/receive difficult feedback?"',
        'AA round is the final gate: "Why Microsoft? What would you build here?"'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // APPLE — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  apple: {
    dsa: {
      philosophy: `Apple DSA interviews focus on CODE QUALITY and ATTENTION TO DETAIL. Apple engineers build products used by billions — a bug in iOS affects every iPhone user. Apple interviewers will notice if you handle error cases, if your variable names are meaningful, if your code is clean enough to ship. They may give you problems inspired by real Apple engineering challenges — string processing for Siri, memory management, concurrency.`,

      topicDistribution: {
        'arrays-and-strings': { frequency: '25-30%', notes: 'String manipulation (Unicode, internationalization), array operations. Apple deals with internationalized text (Arabic, Chinese, emoji) so string problems may have encoding twists.' },
        'concurrency': { frequency: '10-15%', notes: 'UNIQUE to Apple interviews. Thread safety, producer-consumer, deadlock prevention. Apple is multi-threaded by nature (iOS Grand Central Dispatch).' },
        'trees-and-graphs': { frequency: '20-25%', notes: 'Tree traversals, graph problems. Apple\'s file system, UI view hierarchy, and scene graphs are all trees.' },
        'design-problems': { frequency: '10-15%', notes: 'Implement data structures considering memory efficiency. Apple cares about device constraints — RAM is limited on phones.' },
        'dynamic-programming': { frequency: '10-15%', notes: 'Medium DP. Apple may frame DP problems in terms of optimization under constraints (battery, memory).' },
        'bit-manipulation-and-low-level': { frequency: '5-10%', notes: 'More common at Apple than other companies. Bit operations, memory layout, low-level optimizations.' }
      },

      probingPatterns: [
        { trigger: 'Candidate writes code', response: '"What happens if the input contains emoji? What about right-to-left languages? Apple ships to every country." (Internationalization)' },
        { trigger: 'Candidate handles happy path', response: '"What if this runs on a device with 2GB RAM? Can we reduce memory usage?" (Device constraints)' },
        { trigger: 'Solution works', response: '"How would you test this? What unit tests would you write? What about integration tests?" (Quality obsession)' },
        { trigger: 'Code complete', response: '"I notice your error handling covers X but not Y. What happens if [edge case]?" (Attention to detail)' },
        { trigger: 'Good solution', response: '"How would you make this thread-safe? What if multiple threads call this simultaneously?"' }
      ],

      whatMakesAppleDSAUnique: `Apple interviews are TEAM-SPECIFIC — you interview for a specific team, and the coding problems may relate to that team's work. If you're interviewing for the Siri team, expect string/NLP problems. If it's the GPU team, expect low-level optimization. Apple also cares about platform knowledge — knowing iOS/macOS APIs and frameworks is a plus (not required, but noticed).`
    },

    hld: {
      philosophy: `Apple system design is PRODUCT-DRIVEN and PRIVACY-FIRST. Apple's systems must work seamlessly across devices (iPhone, Mac, iPad, Watch, TV) and privacy is a non-negotiable constraint. End-to-end encryption, on-device processing, and minimal data collection are core to Apple's design philosophy. "What data leaves the device?" is a question Apple interviewers always ask.`,

      topicDistribution: {
        'sync-and-storage': { frequency: '25-30%', notes: 'iCloud sync, photo library, document storage. Tests conflict resolution, offline-first design, cross-device sync.' },
        'messaging-and-communication': { frequency: '15-20%', notes: 'iMessage, FaceTime. Tests E2E encryption, media transfer, group communications with Apple\'s privacy requirements.' },
        'media': { frequency: '15-20%', notes: 'Apple Music, Apple TV+, Podcasts. Tests streaming, DRM, download management, adaptive quality.' },
        'on-device-ml': { frequency: '10-15%', notes: 'Siri, photo search, on-device intelligence. Tests ML model serving on constrained devices, federated learning.' },
        'payments-and-commerce': { frequency: '10-15%', notes: 'Apple Pay, App Store. Tests secure transaction processing, tokenization, PCI compliance.' },
        'health-and-sensors': { frequency: '5-10%', notes: 'HealthKit, sensor data processing. Tests real-time data streams, privacy, data aggregation.' }
      },

      companySpecificSystems: [
        'Design iCloud Photo Library (sync + dedup + ML search + privacy)',
        'Design iMessage (E2E encryption + media + group + cross-device)',
        'Design Apple Maps (offline maps + routing + live traffic + privacy)',
        'Design Siri (speech → intent → action + on-device + privacy)',
        'Design AirDrop (peer discovery + transfer + security)',
        'Design Apple Pay (tokenization + NFC + secure element)',
        'Design App Store Review System (submission + review + distribution)',
        'Design Find My (device tracking + crowdsourced network + privacy)'
      ],

      probingPatterns: [
        { trigger: 'Any design decision', response: '"What data leaves the device? Can we do this processing on-device instead?" (Privacy-first)' },
        { trigger: 'Database choice', response: '"How does this sync across iPhone, Mac, and iPad? What about conflict resolution when the user is offline?"' },
        { trigger: 'API designed', response: '"What happens on a slow network? How does this degrade gracefully? What does the user see?"' },
        { trigger: 'System handles normal case', response: '"What about accessibility? How does VoiceOver interact with this? What about Dynamic Type?"' }
      ]
    },

    lld: {
      philosophy: `Apple LLD emphasizes craftsmanship — elegant design with attention to every edge case. Thread safety is almost always discussed. Memory management considerations (even with ARC) show maturity.`,

      companySpecificProblems: [
        'Design an Animation Framework (timing + easing + composable)',
        'Design a Push Notification Handling System',
        'Design a Dependency Injection Container',
        'Design a Cache with disk and memory tiers (constrained device)',
        'Design a Photo Filter Pipeline (composable + threadsafe)',
        'Design an Undo/Redo System for a drawing app'
      ]
    },

    behavioral: {
      philosophy: `Apple behavioral rounds focus on TEAM FIT and PASSION FOR CRAFT. Apple interviews are team-specific, so your interviewers are people you'll actually work with daily. They want to know: Do you care about details? Do you push for quality? Can you work in a tight-knit team with strong opinions? Apple also values SECRECY — they want to know you can handle working on unannounced products without leaking.`,

      uniquePatterns: [
        'Passion for craft: "What product have you built that you\'re most proud of? Why?"',
        'Attention to detail: "Tell me about a time you caught something others missed."',
        'Team fit: "How do you handle disagreements in a small team?"',
        'Quality over speed: "Tell me about a time you pushed back on a deadline to maintain quality."',
        'User empathy: "How do you think about the end user experience in your work?"'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // NETFLIX — Question Intelligence
  // ═══════════════════════════════════════════════════════════════════
  netflix: {
    dsa: {
      philosophy: `Netflix treats EVERY candidate as a senior hire. They don't ask LeetCode-style puzzle problems — they prefer practical, production-quality coding challenges. Netflix interviewers want to see: error handling, logging, testing considerations, performance awareness. They may ask you to design AND implement a small system in 60 minutes. The code should look like something you'd PR into a real codebase, not interview code.`,

      topicDistribution: {
        'system-implementation': { frequency: '25-30%', notes: 'Implement a rate limiter, implement a cache with TTL, implement a circuit breaker. Netflix invented many of these patterns (Hystrix, Zuul). They want working implementations, not just algorithms.' },
        'concurrency': { frequency: '15-20%', notes: 'Thread-safe data structures, producer-consumer, async patterns. Netflix is JVM-based and highly concurrent.' },
        'data-structures': { frequency: '20-25%', notes: 'Custom data structure design and implementation. Efficient caches (EVCache), concurrent maps, skip lists.' },
        'string-and-data-processing': { frequency: '10-15%', notes: 'Content matching, subtitle processing, data pipeline operations.' },
        'graph-algorithms': { frequency: '10-15%', notes: 'Recommendation graphs, content similarity. Tests practical graph applications, not theoretical graph theory.' },
        'optimization': { frequency: '10-15%', notes: 'Performance optimization, memory optimization. Netflix streams to 260M+ subscribers — every millisecond and byte matters.' }
      },

      probingPatterns: [
        { trigger: 'Code submitted', response: '"Would you merge this PR as-is? What would a code reviewer say? Where are the tests?" (Production quality)' },
        { trigger: 'Solution works', response: '"How would you monitor this in production? What metrics would you emit? What constitutes an alert?"' },
        { trigger: 'Happy path handled', response: '"What happens when the dependency this calls is down? How do you fail gracefully? What\'s the fallback?"' },
        { trigger: 'Candidate discusses tradeoffs', response: '"Good. Now, this runs on 1000 instances across 3 regions. What changes? What about consistency?"' },
        { trigger: 'Good implementation', response: '"Let\'s add chaos. What if I randomly kill 30% of your instances? Does the system survive? How?" (Chaos Engineering mindset)' }
      ],

      whatMakesNetflixDSAUnique: `Netflix rarely asks "find the shortest path in a graph" or "count subsets that sum to K." Instead, they'll ask: "Implement a thread-safe LRU cache with TTL support" or "Build a rate limiter that handles 100K req/s." The problems are PRACTICAL and the code must be PRODUCTION-QUALITY. They also have a deep JVM (Java/Kotlin) culture, though you can use any language.`
    },

    hld: {
      philosophy: `Netflix system design interviews go DEEP into distributed systems, resilience, and streaming. Netflix runs on AWS and has pioneered chaos engineering, circuit breakers, and microservice architecture. They expect you to understand failure modes deeply — "What happens when [component] fails?" is asked for every component. Netflix interviewers also expect you to understand content delivery (CDN, Open Connect) and video encoding because streaming is their core business.`,

      topicDistribution: {
        'streaming-and-cdn': { frequency: '25-30%', notes: 'Video encoding pipeline, adaptive bitrate, CDN (Open Connect), DRM. This is Netflix\'s core. You MUST understand how video gets from camera to screen.' },
        'recommendation-and-personalization': { frequency: '20-25%', notes: 'Content recommendation, homepage personalization, A/B testing. Netflix\'s competitive advantage is personalization — 80% of watched content comes from recommendations.' },
        'resilience-and-infrastructure': { frequency: '20-25%', notes: 'Circuit breakers, chaos engineering, service mesh. Netflix literally wrote the book on resilience patterns.' },
        'data-pipeline': { frequency: '10-15%', notes: 'Analytics pipeline, real-time event processing, data warehouse. Netflix processes petabytes of viewing data daily.' },
        'content-platform': { frequency: '10-15%', notes: 'Content management, studio tools, global content delivery. Tests understanding of content lifecycle.' },
        'search-and-discovery': { frequency: '5-10%', notes: 'Search ranking, content discovery, personalized browse experience.' }
      },

      companySpecificSystems: [
        'Design Netflix Video Streaming Pipeline (ingest → encode → CDN → play)',
        'Design Netflix Recommendation Engine (collaborative + content-based + real-time)',
        'Design Netflix A/B Testing Platform (experiments at scale)',
        'Design Netflix CDN (Open Connect — ISP-embedded CDN appliances)',
        'Design Chaos Monkey / Chaos Engineering Platform',
        'Design Netflix Search (content search + ranking + personalization)',
        'Design Netflix Studio Workflow (content creation → delivery → analytics)',
        'Design Netflix Playback Session Manager (resume + multi-device + quality)'
      ],

      probingPatterns: [
        { trigger: 'Candidate designs system', response: '"Now let\'s inject chaos. I\'m killing your primary database. What happens? How does the user experience degrade?"' },
        { trigger: 'Service architecture drawn', response: '"What happens when service B is slow? How do you prevent cascading failures? What patterns do you use?" (Circuit breaker)' },
        { trigger: 'Data flow designed', response: '"This processes 500TB of events daily. How does the pipeline handle backpressure? What if a consumer falls behind?"' },
        { trigger: 'CDN discussed', response: '"Netflix serves 15% of all internet traffic. How do you decide what to cache where? How do you handle a new release that everyone watches at once?"' }
      ]
    },

    lld: {
      philosophy: `Netflix LLD expects senior-level design with resilience patterns built in. Circuit breaker, retry with backoff, and fallback behaviors should be part of your design, not afterthoughts.`,

      companySpecificProblems: [
        'Design a Circuit Breaker Library (states + thresholds + fallback)',
        'Design a Feature Flag System (rules + targeting + rollout)',
        'Design a Distributed Rate Limiter',
        'Design a Video Quality Selector (adaptive + device-aware)',
        'Design a Retry Framework with exponential backoff and jitter',
        'Design a Health Check / Service Registry system'
      ]
    },

    behavioral: {
      philosophy: `Netflix behavioral interviews evaluate against their Culture Deck — Freedom & Responsibility. They expect SENIOR-LEVEL judgment regardless of your title. Netflix pays top of market and expects top of market performance. They'll ask about times you operated autonomously, gave radical candor, and made unpopular decisions because they were right. The "Keeper Test" is real: "Would your manager fight to keep you?"`,

      uniquePatterns: [
        'Freedom & Responsibility: "Tell me about a decision you made without asking permission."',
        'Radical Candor: "Tell me about the hardest feedback you\'ve ever given."',
        'Keeper Test: "Why should we fight to keep you? What\'s unique about your contribution?"',
        'Senior judgment: "Tell me about a time you made a difficult call with incomplete information."',
        'No brilliant jerks: "How do your teammates describe working with you?"',
        'Context not control: "How do you decide what to work on without being told?"'
      ]
    }
  }
};

/**
 * Get the full question intelligence for a company
 */
function getQuestionIntelligence(company) {
  return QUESTION_INTELLIGENCE[company.toLowerCase()] || null;
}

/**
 * Get round-specific question intelligence
 */
function getRoundIntelligence(company, roundType) {
  const intel = QUESTION_INTELLIGENCE[company.toLowerCase()];
  return intel ? intel[roundType] || null : null;
}

/**
 * Get topic distribution for a company's round
 */
function getTopicDistribution(company, roundType) {
  const intel = getRoundIntelligence(company, roundType);
  return intel?.topicDistribution || null;
}

/**
 * Get probing patterns for a company's round
 */
function getProbingPatterns(company, roundType) {
  const intel = getRoundIntelligence(company, roundType);
  return intel?.probingPatterns || [];
}

/**
 * Get company-specific system design problems
 */
function getCompanySpecificProblems(company, roundType) {
  const intel = getRoundIntelligence(company, roundType);
  return intel?.companySpecificSystems || intel?.companySpecificProblems || [];
}

/**
 * Build a question intelligence prompt section for injection into system prompts
 */
function buildQuestionIntelligencePrompt(company, roundType) {
  const intel = getRoundIntelligence(company, roundType);
  if (!intel) return '';

  let prompt = `\n═══ QUESTION INTELLIGENCE FOR ${company.toUpperCase()} ${roundType.toUpperCase()} ═══\n`;
  prompt += `\n📋 QUESTION PHILOSOPHY:\n${intel.philosophy}\n`;

  if (intel.topicDistribution) {
    prompt += `\n📊 TOPIC FREQUENCY DISTRIBUTION (what ${company} actually asks):\n`;
    for (const [topic, data] of Object.entries(intel.topicDistribution)) {
      prompt += `  • ${topic}: ${data.frequency} — ${data.notes}\n`;
    }
  }

  if (intel.probingPatterns) {
    prompt += `\n🎯 PROBING PATTERNS (how to follow up like a real ${company} interviewer):\n`;
    for (const pattern of intel.probingPatterns) {
      prompt += `  • When: "${pattern.trigger}" → ${pattern.response}\n`;
    }
  }

  if (intel.whatMakesGoogleDSAUnique || intel.whatMakesAmazonDSAUnique || intel.whatMakesMetaDSAUnique || intel.whatMakesMicrosoftDSAUnique || intel.whatMakesAppleDSAUnique || intel.whatMakesNetflixDSAUnique) {
    const unique = intel.whatMakesGoogleDSAUnique || intel.whatMakesAmazonDSAUnique || intel.whatMakesMetaDSAUnique || intel.whatMakesMicrosoftDSAUnique || intel.whatMakesAppleDSAUnique || intel.whatMakesNetflixDSAUnique;
    prompt += `\n⚡ WHAT MAKES THIS UNIQUE:\n${unique}\n`;
  }

  if (intel.twoProblemsFormat) {
    prompt += `\n⚠️ FORMAT NOTE:\n${intel.twoProblemsFormat}\n`;
  }

  if (intel.oaPatterns) {
    prompt += `\n📝 OA CONTEXT:\n${intel.oaPatterns}\n`;
  }

  if (intel.awsAwareness) {
    prompt += `\n☁️ AWS AWARENESS:\n${intel.awsAwareness}\n`;
  }

  if (intel.difficultyCalibration) {
    prompt += `\n📈 DIFFICULTY CALIBRATION:\n`;
    for (const [level, desc] of Object.entries(intel.difficultyCalibration)) {
      prompt += `  • ${level}: ${desc}\n`;
    }
  }

  if (intel.uniquePatterns) {
    prompt += `\n🔑 UNIQUE PATTERNS FOR THIS ROUND:\n`;
    for (const p of intel.uniquePatterns) {
      prompt += `  • ${p}\n`;
    }
  }

  if (intel.lpMappingToQuestions) {
    prompt += `\n📋 LP → QUESTION MAPPING:\n`;
    for (const [lp, question] of Object.entries(intel.lpMappingToQuestions)) {
      prompt += `  • ${lp}: "${question}"\n`;
    }
  }

  return prompt;
}

module.exports = {
  QUESTION_INTELLIGENCE,
  getQuestionIntelligence,
  getRoundIntelligence,
  getTopicDistribution,
  getProbingPatterns,
  getCompanySpecificProblems,
  buildQuestionIntelligencePrompt
};
