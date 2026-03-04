/**
 * HireSense AI — Seed Data
 * 
 * Seeds the database with initial questions for all companies and round types.
 * 
 * Usage: node src/seed/seedData.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');
const comprehensiveQuestions = require('./comprehensiveQuestions');

const seedQuestions = [
  // ═══ GOOGLE DSA ═══
  {
    title: 'Maximum Subarray with K Distinct Characters',
    description: 'Given a string, find the length of the longest substring that contains at most K distinct characters. Follow up: What if we need to return the actual substring? What if the string contains Unicode characters?',
    company: 'google',
    roundType: 'dsa',
    difficulty: 'medium',
    topic: 'sliding-window',
    subtopics: ['hash-map', 'two-pointers'],
    constraints: ['1 <= s.length <= 10^5', '1 <= k <= 26', 'String contains lowercase English letters'],
    followUpQuestions: [
      'Can you solve this in one pass?',
      'What if K is very large relative to the alphabet size?',
      'How would you handle Unicode characters?',
      'What if we need the actual substring, not just the length?'
    ],
    expectedApproach: {
      bruteForce: 'Check all substrings with a set to count distinct chars — O(n^3)',
      optimal: 'Sliding window with hash map to track character frequencies — O(n)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)'
    },
    hints: ['Think about maintaining a window of valid characters', 'When would you shrink the window?', 'What data structure tracks character counts efficiently?'],
    testCases: [
      { input: 's = "araaci", k = 2', expectedOutput: '4 (araa)', isEdgeCase: false },
      { input: 's = "araaci", k = 1', expectedOutput: '2 (aa)', isEdgeCase: false },
      { input: 's = "cbbebi", k = 3', expectedOutput: '5 (cbbeb)', isEdgeCase: false },
      { input: 's = "", k = 2', expectedOutput: '0', isEdgeCase: true },
      { input: 's = "a", k = 0', expectedOutput: '0', isEdgeCase: true }
    ],
    tags: ['google', 'dsa', 'sliding-window', 'medium', 'strings'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Course Schedule with Prerequisites',
    description: 'There are a total of numCourses courses. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses. If impossible, return an empty array. Follow-up: What if some courses can be taken in parallel?',
    company: 'google',
    roundType: 'dsa',
    difficulty: 'medium',
    topic: 'graphs',
    subtopics: ['topological-sort', 'bfs', 'dfs'],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)', 'All pairs are unique'],
    expectedApproach: {
      bruteForce: 'Try all permutations and check validity — O(n!)',
      optimal: 'Topological sort using BFS (Kahn\'s algorithm) or DFS — O(V + E)',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)'
    },
    followUpQuestions: ['How do you detect a cycle?', 'Can you do this with DFS instead?', 'What if we want minimum semesters to complete all courses?'],
    tags: ['google', 'dsa', 'graphs', 'topological-sort', 'medium'],
    source: { type: 'manual', year: 2025 }
  },

  // ═══ AMAZON DSA ═══
  {
    title: 'Optimal Delivery Route',
    description: 'You are a delivery driver with a list of N delivery locations on a 2D grid. Starting from the warehouse at (0,0), find the K closest delivery locations to the warehouse. What is the optimal route to visit them all? First solve the K-closest problem, then discuss the routing optimization.',
    company: 'amazon',
    roundType: 'dsa',
    difficulty: 'medium',
    topic: 'heaps',
    subtopics: ['sorting', 'geometry', 'greedy'],
    constraints: ['1 <= K <= N <= 10^5', '-10^4 <= x, y <= 10^4'],
    expectedApproach: {
      bruteForce: 'Sort all points by distance — O(n log n)',
      optimal: 'Max-heap of size K (or QuickSelect) — O(n log k) or O(n) average',
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(k)'
    },
    followUpQuestions: [
      'Why a max-heap and not a min-heap?',
      'Can you do better than O(n log k)?',
      'How would QuickSelect work here?',
      'Now how would you optimize the actual route? (TSP variant discussion)'
    ],
    tags: ['amazon', 'dsa', 'heaps', 'medium'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Product Inventory Restock',
    description: 'Amazon has N warehouses. Each warehouse has an inventory level. You can restock any warehouse by adding units, but each restock operation costs a fixed amount regardless of units. Given a target minimum inventory T for each warehouse and a budget of B restock operations, maximize the minimum inventory across all warehouses.',
    company: 'amazon',
    roundType: 'dsa',
    difficulty: 'hard',
    topic: 'binary-search',
    subtopics: ['greedy', 'arrays'],
    constraints: ['1 <= N <= 10^5', '0 <= inventory[i] <= 10^9', '1 <= B <= 10^9'],
    expectedApproach: {
      bruteForce: 'Try all possible minimum inventory values — O(max * n)',
      optimal: 'Binary search on answer + greedy verification — O(n log(max))',
      timeComplexity: 'O(n log(max_value))',
      spaceComplexity: 'O(1)'
    },
    tags: ['amazon', 'dsa', 'binary-search', 'hard'],
    source: { type: 'manual', year: 2025 }
  },

  // ═══ META DSA ═══
  {
    title: 'Minimum Window Substring',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.',
    company: 'meta',
    roundType: 'dsa',
    difficulty: 'hard',
    topic: 'sliding-window',
    subtopics: ['hash-map', 'two-pointers'],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5'],
    expectedApproach: {
      bruteForce: 'Check all substrings — O(m^2 * n)',
      optimal: 'Sliding window with character frequency map — O(m + n)',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(m + n)'
    },
    tags: ['meta', 'dsa', 'sliding-window', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Alien Dictionary',
    description: 'There is a new alien language that uses the English alphabet. However, the order among the letters is unknown. You are given a list of strings words from the alien language\'s dictionary, where the strings are sorted lexicographically by the rules of this new language. Derive the order of letters in this language.',
    company: 'meta',
    roundType: 'dsa',
    difficulty: 'hard',
    topic: 'graphs',
    subtopics: ['topological-sort', 'hash-map'],
    expectedApproach: {
      bruteForce: 'N/A — this requires graph modeling',
      optimal: 'Build directed graph from adjacent words, then topological sort — O(C) where C is total characters',
      timeComplexity: 'O(C)',
      spaceComplexity: 'O(U + min(U^2, N)) where U is unique letters'
    },
    tags: ['meta', 'dsa', 'graphs', 'topological-sort', 'hard'],
    source: { type: 'manual', year: 2025 }
  },

  // ═══ SYSTEM DESIGN (HLD) ═══
  {
    title: 'Design a Video Streaming Platform',
    description: 'Design a video streaming service like Netflix or YouTube. Users can upload videos, search, browse recommendations, and stream content. The system must handle millions of concurrent viewers with adaptive bitrate streaming. Consider content delivery, encoding pipeline, and recommendation engine.',
    company: 'netflix',
    roundType: 'hld',
    difficulty: 'hard',
    topic: 'system-design',
    subtopics: ['video-encoding', 'cdn', 'recommendation-engine', 'streaming'],
    tags: ['netflix', 'hld', 'system-design', 'streaming', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design Google Search',
    description: 'Design a web search engine. Consider web crawling, indexing, ranking (PageRank), query processing, spell correction, and serving results with low latency. The system indexes billions of web pages and serves billions of queries per day.',
    company: 'google',
    roundType: 'hld',
    difficulty: 'hard',
    topic: 'system-design',
    subtopics: ['web-crawler', 'inverted-index', 'ranking', 'distributed-systems'],
    tags: ['google', 'hld', 'system-design', 'search', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design Amazon Order Processing',
    description: 'Design the order processing system for Amazon. When a user places an order, the system must handle inventory checking, payment processing, order confirmation, shipping coordination, and order tracking. Handle millions of orders during peak events like Prime Day.',
    company: 'amazon',
    roundType: 'hld',
    difficulty: 'hard',
    topic: 'system-design',
    subtopics: ['microservices', 'event-driven', 'saga-pattern', 'distributed-transactions'],
    tags: ['amazon', 'hld', 'system-design', 'e-commerce', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design Instagram',
    description: 'Design a photo and video sharing social network like Instagram. Users can post photos/reels, follow other users, like and comment on posts, see a personalized feed, and receive notifications. Handle billions of users and posts.',
    company: 'meta',
    roundType: 'hld',
    difficulty: 'medium',
    topic: 'system-design',
    subtopics: ['news-feed', 'social-graph', 'media-storage', 'notification-system'],
    tags: ['meta', 'hld', 'system-design', 'social-media', 'medium'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design iCloud Sync',
    description: 'Design a cloud synchronization service like iCloud. Users\' data (photos, documents, settings) should sync across all their Apple devices in near real-time. Handle conflict resolution, offline changes, and end-to-end encryption. Consider device constraints and battery optimization.',
    company: 'apple',
    roundType: 'hld',
    difficulty: 'hard',
    topic: 'system-design',
    subtopics: ['sync', 'conflict-resolution', 'encryption', 'offline-first'],
    tags: ['apple', 'hld', 'system-design', 'sync', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design Microsoft Teams',
    description: 'Design a collaboration platform like Microsoft Teams. Support real-time messaging, video conferencing, file sharing, screen sharing, channels/teams organization, and integration with third-party apps. Handle enterprise-scale deployment with compliance requirements.',
    company: 'microsoft',
    roundType: 'hld',
    difficulty: 'hard',
    topic: 'system-design',
    subtopics: ['real-time-communication', 'webrtc', 'enterprise', 'compliance'],
    tags: ['microsoft', 'hld', 'system-design', 'collaboration', 'hard'],
    source: { type: 'manual', year: 2025 }
  },

  // ═══ LLD ═══
  {
    title: 'Design an Online Chess Game',
    description: 'Design the object-oriented model for an online chess game. Support standard chess rules, move validation, game state management, undo moves, game replay, and multiplayer functionality. Consider extensibility for variants like Chess960.',
    company: 'google',
    roundType: 'lld',
    difficulty: 'medium',
    topic: 'object-oriented-design',
    subtopics: ['design-patterns', 'state-management', 'game-logic'],
    tags: ['google', 'lld', 'ood', 'game-design', 'medium'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Task Scheduler',
    description: 'Design a distributed task scheduler that can schedule and execute tasks at specified times or intervals. Support one-time tasks, recurring tasks, priorities, retries on failure, and task dependencies. Handle concurrent execution and failure recovery.',
    company: 'amazon',
    roundType: 'lld',
    difficulty: 'hard',
    topic: 'object-oriented-design',
    subtopics: ['concurrency', 'scheduling', 'retry-patterns'],
    tags: ['amazon', 'lld', 'ood', 'scheduler', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Notification System',
    description: 'Design the low-level architecture for a notification system that supports multiple channels (push, email, SMS, in-app). Support notification preferences, rate limiting per user, batching, templates, and priority levels.',
    company: 'meta',
    roundType: 'lld',
    difficulty: 'medium',
    topic: 'object-oriented-design',
    subtopics: ['strategy-pattern', 'observer-pattern', 'template-pattern'],
    tags: ['meta', 'lld', 'ood', 'notification', 'medium'],
    source: { type: 'manual', year: 2025 }
  },

  // ═══ BEHAVIORAL ═══
  {
    title: 'Technical Conflict Resolution',
    description: 'Tell me about a time you had a significant technical disagreement with a senior engineer or tech lead. How did you handle it? What data or evidence did you use? What was the outcome, and what would you do differently?',
    company: 'google',
    roundType: 'behavioral',
    difficulty: 'hard',
    topic: 'conflict-resolution',
    tags: ['google', 'behavioral', 'conflict', 'hard'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Delivering Under Extreme Pressure',
    description: 'Tell me about a time you had to deliver a critical system or feature under extreme time pressure with high stakes. How did you prioritize? What shortcuts did you take (if any), and how did you ensure quality? What was the quantifiable result?',
    company: 'amazon',
    roundType: 'behavioral',
    difficulty: 'hard',
    topic: 'leadership',
    tags: ['amazon', 'behavioral', 'leadership', 'hard', 'deliver-results'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Driving Impact at Scale',
    description: 'Tell me about the project you\'re most proud of. What was the problem, what was your specific contribution, and what was the measurable impact? How did it change things for users?',
    company: 'meta',
    roundType: 'behavioral',
    difficulty: 'medium',
    topic: 'impact',
    tags: ['meta', 'behavioral', 'impact', 'medium'],
    source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Senior Judgment Call',
    description: 'Tell me about a time you had to make a critical technical or business decision without all the information you wanted. What was at stake? How did you reason through it? Would you make the same decision again?',
    company: 'netflix',
    roundType: 'behavioral',
    difficulty: 'hard',
    topic: 'judgment',
    tags: ['netflix', 'behavioral', 'judgment', 'hard'],
    source: { type: 'manual', year: 2025 }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresense');
    console.log('✅ Connected to MongoDB');

    // Check if already seeded
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Database already has ${existingCount} questions.`);
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      const answer = await new Promise(resolve => {
        rl.question('Do you want to add seed data anyway? (y/n): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Skipped seeding.');
        await mongoose.disconnect();
        return;
      }
    }

    let added = 0;
    const allQuestions = [...seedQuestions, ...comprehensiveQuestions];
    console.log(`📚 Total questions to seed: ${allQuestions.length}`);
    
    for (const q of allQuestions) {
      const exists = await Question.findOne({ title: q.title, company: q.company, roundType: q.roundType });
      if (!exists) {
        await Question.create(q);
        added++;
        console.log(`  ✅ Added: [${q.company}/${q.roundType}] ${q.title}`);
      } else {
        console.log(`  ⏭️  Skipped: [${q.company}/${q.roundType}] ${q.title} (exists)`);
      }
    }

    console.log(`\n🎉 Seeding complete! Added ${added} questions (${allQuestions.length - added} skipped).`);
    console.log(`📊 Total questions in DB: ${await Question.countDocuments()}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seedQuestions, seed };
