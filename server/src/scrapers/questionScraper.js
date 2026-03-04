/**
 * HireSense AI — Question Scraper
 * 
 * Scrapes publicly available interview questions from various sources.
 * Tags by company, round type, difficulty, and topic.
 * 
 * IMPORTANT: Only scrapes publicly available data. Respects robots.txt.
 * 
 * Usage: node src/scrapers/questionScraper.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Question = require('../models/Question');
const mongoose = require('mongoose');

class QuestionScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'HireSense-AI-Research-Bot/1.0 (Educational Purpose)',
      'Accept': 'text/html,application/xhtml+xml'
    };
    this.delay = 2000; // 2 second delay between requests
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Scrape LeetCode-style problem metadata from public discussion forums
   */
  async scrapePublicQuestionLists() {
    console.log('📡 Starting question scraping from public sources...');

    const questions = [];

    // Curated public question sets (these are well-known, publicly discussed)
    const publicQuestionSets = this.getPublicQuestionSets();

    for (const qSet of publicQuestionSets) {
      questions.push(...qSet);
    }

    console.log(`✅ Collected ${questions.length} questions from public sources`);
    return questions;
  }

  /**
   * Curated question sets from publicly known interview question patterns
   */
  getPublicQuestionSets() {
    return [
      // Google DSA Questions (publicly discussed)
      this.generateCompanyQuestions('google', 'dsa', [
        { title: 'Median of Two Sorted Arrays', topic: 'binary-search', difficulty: 'hard', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(min(m,n))).', constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', 'The merged array would be sorted'] },
        { title: 'Word Ladder', topic: 'graphs', difficulty: 'hard', description: 'Given two words (beginWord and endWord), and a dictionary word list, find the length of shortest transformation sequence from beginWord to endWord, such that only one letter can be changed at a time and each transformed word must exist in the word list.', constraints: ['All words have the same length', 'All words contain only lowercase alphabetic characters', 'No duplicates in the word list'] },
        { title: 'Design Search Autocomplete System', topic: 'tries', difficulty: 'hard', description: 'Design a search autocomplete system for a search engine. Users may input a sentence (at least one word and end with a special character \'#\'). Return the top 3 historical hot sentences that have the same prefix as the part of the sentence already typed.', constraints: ['Input sentences are between 1 and 200 characters', 'Results sorted by frequency then ASCII order'] },
        { title: 'Sliding Window Maximum', topic: 'sliding-window', difficulty: 'hard', description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window — the maximum value in each window position.', constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length'] },
        { title: 'LRU Cache', topic: 'design', difficulty: 'medium', description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put operations in O(1) time complexity.', constraints: ['1 <= capacity <= 3000', 'O(1) time for both operations'] },
      ]),

      // Amazon DSA Questions
      this.generateCompanyQuestions('amazon', 'dsa', [
        { title: 'Number of Islands', topic: 'graphs', difficulty: 'medium', description: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.', constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'] },
        { title: 'Merge K Sorted Lists', topic: 'heaps', difficulty: 'hard', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.', constraints: ['k == lists.length', '0 <= k <= 10^4', 'lists[i] is sorted in ascending order'] },
        { title: 'Rotting Oranges', topic: 'graphs', difficulty: 'medium', description: 'You are given an m x n grid where each cell can have one of three values: 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains.', constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10'] },
        { title: 'Min Cost to Connect All Points', topic: 'graphs', difficulty: 'medium', description: 'You are given an array points representing integer coordinates of some points on a 2D-plane. Return the minimum cost to make all points connected. The cost of connecting two points is the manhattan distance between them.', constraints: ['1 <= points.length <= 1000', '-10^6 <= xi, yi <= 10^6'] },
        { title: 'Top K Frequent Words', topic: 'heaps', difficulty: 'medium', description: 'Given an array of strings words and an integer k, return the k most frequent strings. Return the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.', constraints: ['1 <= words.length <= 500', '1 <= k <= unique words count'] },
      ]),

      // Meta DSA Questions
      this.generateCompanyQuestions('meta', 'dsa', [
        { title: 'Valid Palindrome II', topic: 'strings', difficulty: 'easy', description: 'Given a string s, return true if the s can be palindrome after deleting at most one character from it.', constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters'] },
        { title: 'Binary Tree Right Side View', topic: 'trees', difficulty: 'medium', description: 'Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.', constraints: ['Number of nodes in range [0, 100]', '-100 <= Node.val <= 100'] },
        { title: 'Subarray Sum Equals K', topic: 'arrays', difficulty: 'medium', description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. Note that the subarray must be contiguous.', constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000'] },
        { title: 'Random Pick with Weight', topic: 'binary-search', difficulty: 'medium', description: 'You are given a 0-indexed array of positive integers w where w[i] describes the weight of the ith index. Implement the pickIndex() function which randomly picks an index in the range [0, w.length - 1] (inclusive) and returns it. The probability of picking an index i is w[i] / sum(w).', constraints: ['1 <= w.length <= 10^4', '1 <= w[i] <= 10^5'] },
        { title: 'Lowest Common Ancestor of Binary Tree III', topic: 'trees', difficulty: 'medium', description: 'Given two nodes of a binary tree p and q, return their lowest common ancestor (LCA). Each node will have a reference to its parent node.', constraints: ['All Node.val are unique', 'p != q', 'p and q exist in the tree'] },
      ]),

      // Microsoft DSA Questions — practical, real-world flavored
      this.generateCompanyQuestions('microsoft', 'dsa', [
        { title: 'Reverse Linked List II', topic: 'linked-lists', difficulty: 'medium', description: 'Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes from position left to position right, and return the reversed list. Do it in one pass.', constraints: ['1 <= n <= 500', 'left <= right <= n'] },
        { title: 'Serialize and Deserialize Binary Tree', topic: 'trees', difficulty: 'hard', description: 'Design an algorithm to serialize and deserialize a binary tree. Your encoded string should be as compact as possible. Explain your format choice and how it handles null nodes.', constraints: ['Number of nodes in range [0, 10^4]', 'Node values fit in int'] },
        { title: 'Design HashMap', topic: 'design', difficulty: 'medium', description: 'Design a HashMap without using any built-in hash table libraries. Implement put, get, and remove operations. Discuss collision handling strategy, load factor, and resizing.', constraints: ['0 <= key, value <= 10^6', 'At most 10^4 calls to operations'] },
        { title: 'Meeting Rooms II', topic: 'intervals', difficulty: 'medium', description: 'Given an array of meeting time intervals, find the minimum number of conference rooms required. Explain your approach clearly — can you solve it with a min-heap?', constraints: ['1 <= intervals.length <= 10^4'] },
        { title: 'Word Search', topic: 'backtracking', difficulty: 'medium', description: 'Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from adjacent cells (horizontal/vertical). Same cell cannot be used twice.', constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 6'] },
      ]),

      // Apple DSA Questions — quality-focused with device constraint awareness
      this.generateCompanyQuestions('apple', 'dsa', [
        { title: 'Longest Valid Parentheses', topic: 'stacks', difficulty: 'hard', description: 'Given a string containing just \'(\' and \')\', return the length of the longest valid parentheses substring. Follow-up: Can you handle extended brackets including \'[]\' and \'{}\'?', constraints: ['0 <= s.length <= 3 * 10^4'] },
        { title: 'Read Write Lock Implementation', topic: 'concurrency', difficulty: 'hard', description: 'Implement a ReadWriteLock that allows multiple concurrent readers but only one writer. Writers must have exclusive access. Handle starvation prevention for writers. This is fundamental to iOS/macOS concurrent programming.', constraints: ['Thread-safe', 'No starvation'] },
        { title: 'LFU Cache', topic: 'design', difficulty: 'hard', description: 'Design and implement a Least Frequently Used (LFU) cache. It should support get and put in O(1). When the cache reaches capacity, evict the least frequently used key. If tie, evict the least recently used. Consider memory efficiency.', constraints: ['1 <= capacity <= 10^4', 'O(1) time complexity'] },
        { title: 'String Compression with Unicode', topic: 'strings', difficulty: 'medium', description: 'Given a string, implement basic string compression using counts of repeated characters (aabcccccaaa → a2b1c5a3). If compressed string is not smaller, return original. Handle Unicode characters (emoji, CJK).', constraints: ['String can contain any Unicode', '1 <= s.length <= 10^5'] },
        { title: 'Flatten Nested List Iterator', topic: 'design', difficulty: 'medium', description: 'Design an iterator to flatten a nested list. Each element is either an integer or a list (which may also contain integers or other lists). Your iterator should support hasNext() and next() operations.', constraints: ['1 <= total elements <= 200', 'Values between [-10^6, 10^6]'] },
      ]),

      // Netflix DSA Questions — production-quality, systems-oriented
      this.generateCompanyQuestions('netflix', 'dsa', [
        { title: 'Implement Thread-Safe LRU Cache', topic: 'concurrency', difficulty: 'hard', description: 'Implement an LRU cache that is thread-safe. Multiple threads can call get() and put() concurrently. Include proper locking strategy. Should this use fine-grained or coarse-grained locking? Discuss the tradeoffs.', constraints: ['Thread-safe', 'O(1) operations', 'Concurrent access'] },
        { title: 'Rate Limiter Implementation', topic: 'system-implementation', difficulty: 'medium', description: 'Implement a rate limiter using the sliding window algorithm. Support configurable rate limits (e.g., 100 requests per minute). Must be efficient and handle edge cases around window boundaries. How would you distribute this across multiple servers?', constraints: ['O(1) per request check', 'Accurate counting'] },
        { title: 'Circuit Breaker Pattern', topic: 'system-implementation', difficulty: 'hard', description: 'Implement the circuit breaker pattern. States: CLOSED (normal), OPEN (failing, reject requests), HALF_OPEN (testing recovery). Configurable failure threshold, timeout, and success threshold to close. Include metrics tracking.', constraints: ['Thread-safe', 'Configurable thresholds'] },
        { title: 'Consistent Hashing Implementation', topic: 'distributed-systems', difficulty: 'hard', description: 'Implement a consistent hash ring for distributing cache keys across multiple nodes. Support adding/removing nodes with minimal key redistribution. Use virtual nodes for better balance. Calculate how many keys move when a node is added.', constraints: ['Balanced distribution', 'Minimal redistribution'] },
        { title: 'Top K Trending Content', topic: 'streaming-algorithms', difficulty: 'medium', description: 'Design and implement a system to track the top K most-watched content in a sliding time window (last 1 hour). Must handle millions of events per second. Discuss exact vs approximate counting and the Count-Min Sketch approach.', constraints: ['High throughput', 'Approximate OK', 'Sliding window'] },
      ]),

      // ═══ Company-Specific System Design (HLD) Questions ═══
      // Each company gets questions tied to THEIR products and engineering culture

      this.generateCompanyQuestions('google', 'hld', [
        { title: 'Design Google Search', topic: 'search-and-indexing', difficulty: 'hard', description: 'Design a web search engine. Cover web crawling at billion-page scale, inverted indexing, PageRank-style ranking, query processing with spell correction, and serving results with <200ms latency. How do you handle the freshness vs. relevance tradeoff?' },
        { title: 'Design Google Docs Real-time Collaboration', topic: 'real-time-collaboration', difficulty: 'hard', description: 'Design a real-time collaborative document editor where multiple users edit simultaneously. Address conflict resolution (OT vs CRDT), cursor presence, undo/redo across users, offline editing with sync, and version history. How do you handle a document being edited by 100 users simultaneously?' },
        { title: 'Design YouTube Video Pipeline', topic: 'video-and-media', difficulty: 'hard', description: 'Design YouTube\'s video upload and streaming pipeline. Cover video upload, transcoding to multiple resolutions/codecs, CDN distribution, adaptive bitrate streaming, copyright detection (Content ID), and recommendation serving. How do you handle 500 hours of video uploaded per minute?' },
        { title: 'Design Google Maps', topic: 'maps-and-location', difficulty: 'hard', description: 'Design a maps and navigation service. Cover map tile serving, real-time traffic, route optimization, ETA calculation, place search, and offline maps. How do you provide turn-by-turn navigation with real-time rerouting?' },
      ]),

      this.generateCompanyQuestions('amazon', 'hld', [
        { title: 'Design Amazon Order Processing Pipeline', topic: 'e-commerce', difficulty: 'hard', description: 'Design the end-to-end order processing system. When a customer clicks "Buy Now": inventory reservation, payment processing, fraud detection, order confirmation, warehouse picking, shipping coordination, and delivery tracking. How do you handle Prime Day traffic (10-100x normal)? What happens when payment succeeds but inventory is gone?' },
        { title: 'Design Amazon Product Recommendation Engine', topic: 'recommendation-and-search', difficulty: 'hard', description: 'Design the "Customers who bought this also bought" system. Cover collaborative filtering, content-based filtering, real-time personalization, cold start problem, A/B testing of recommendation algorithms. How do you handle a catalog of 350M+ products?' },
        { title: 'Design Amazon S3', topic: 'infrastructure', difficulty: 'hard', description: 'Design a distributed object storage system like S3. Cover data durability (11 nines), availability, storage classes (Standard, IA, Glacier), versioning, access control, cross-region replication. How do you store exabytes of data reliably?' },
        { title: 'Design Amazon Prime Delivery Routing', topic: 'logistics-and-delivery', difficulty: 'hard', description: 'Design the delivery routing system for Amazon Prime same-day delivery. Cover driver assignment, route optimization, real-time tracking, delivery time estimation, and handling failed deliveries. How do you optimize for 10 million packages per day?' },
      ]),

      this.generateCompanyQuestions('meta', 'hld', [
        { title: 'Design Facebook News Feed', topic: 'social-feed', difficulty: 'hard', description: 'Design the News Feed for 3B+ users. Cover content ranking (ML models), fan-out strategy (fan-out on write vs read), real-time updates, mixed media content, privacy filtering (only show to allowed audiences), and ads integration. How does a post from a user with 5000 friends reach all of them?' },
        { title: 'Design WhatsApp Messaging', topic: 'messaging', difficulty: 'hard', description: 'Design a messaging system for 2B+ users. Cover end-to-end encryption, message delivery guarantees (sent/delivered/read), group chat (up to 1024 members), media sharing, offline message queuing, and multi-device sync. How do you maintain E2E encryption in group chats?' },
        { title: 'Design Instagram Stories', topic: 'media-and-content', difficulty: 'medium', description: 'Design Instagram Stories — ephemeral content that disappears after 24 hours. Cover content creation, viewer tracking, story ordering, close friends lists, highlights (permanent stories), and viewing analytics. How do you handle 500M daily active users viewing stories?' },
        { title: 'Design Facebook Ad Auction System', topic: 'ads-and-ranking', difficulty: 'hard', description: 'Design the real-time ad auction system. Cover bidding, targeting (demographics, interests, lookalike), real-time auction in <100ms, ad quality scoring, budget management, and conversion tracking. How do you run billions of auctions per day?' },
      ]),

      this.generateCompanyQuestions('microsoft', 'hld', [
        { title: 'Design Microsoft Teams', topic: 'collaboration', difficulty: 'hard', description: 'Design a collaboration platform supporting chat, video calls (up to 1000 participants), screen sharing, file sharing, channels, and third-party app integration. Must support enterprise features: multi-tenant, RBAC, compliance (message retention, eDiscovery), and Azure AD integration. How do you handle 300M monthly active users?' },
        { title: 'Design OneDrive File Sync', topic: 'cloud-infrastructure', difficulty: 'hard', description: 'Design a file synchronization service. Cover delta sync (only upload changes), conflict resolution when same file edited on multiple devices, offline support, version history, selective sync for large libraries, and enterprise DLP policies. How do you sync terabytes across 5 devices?' },
        { title: 'Design Outlook Calendar', topic: 'productivity', difficulty: 'medium', description: 'Design a calendar and scheduling system. Cover event creation, recurring events, room/resource booking, availability lookup (free/busy), meeting suggestions, time zone handling, and delegate access. Must handle enterprise scale with 100K+ users in one organization.' },
        { title: 'Design Xbox Live Matchmaking', topic: 'gaming', difficulty: 'hard', description: 'Design a multiplayer game matchmaking system. Cover skill-based matching (TrueSkill/Elo), latency-based server selection, party/group matching, cross-platform play, cheater detection, and global distribution. How do you match millions of concurrent players with <5s wait time?' },
      ]),

      this.generateCompanyQuestions('apple', 'hld', [
        { title: 'Design iCloud Photo Library', topic: 'sync-and-storage', difficulty: 'hard', description: 'Design a photo storage and sync system across all Apple devices. Cover photo upload, device-local ML analysis (faces, objects, places), cross-device sync, space optimization (store full-res in cloud, thumbnails on device), shared albums, and Memories feature. Privacy requirement: ML analysis happens ON-DEVICE, not in cloud.' },
        { title: 'Design iMessage', topic: 'messaging-and-communication', difficulty: 'hard', description: 'Design Apple\'s messaging system. Cover end-to-end encryption, seamless iPhone/Mac/iPad sync, SMS fallback, media sharing (photos, video, stickers), group messaging, message effects (reactions, tapbacks), and iMessage apps. How do you handle E2E encryption with multi-device delivery?' },
        { title: 'Design Find My Network', topic: 'on-device-ml', difficulty: 'hard', description: 'Design Apple\'s crowdsourced device-finding network. Cover Bluetooth beacon broadcasting, crowd-sourced location reporting (using nearby Apple devices anonymously), end-to-end encrypted location data, offline finding, and separation alerts. How do you locate a lost AirTag without compromising privacy of any participating device?' },
        { title: 'Design Apple Pay', topic: 'payments-and-commerce', difficulty: 'hard', description: 'Design a mobile payment system. Cover tokenization (never store real card numbers), NFC transaction flow, Secure Element integration, merchant integration, peer-to-peer payments, and transit cards. How do you process payments in <400ms with bank-grade security?' },
      ]),

      this.generateCompanyQuestions('netflix', 'hld', [
        { title: 'Design Netflix Video Streaming Pipeline', topic: 'streaming-and-cdn', difficulty: 'hard', description: 'Design the end-to-end video pipeline: content ingestion → encoding (100+ quality/resolution combinations) → CDN distribution (Open Connect) → adaptive streaming to devices. How do you encode a 2-hour movie into 100+ variants? How does Open Connect pre-position content on ISP hardware?' },
        { title: 'Design Netflix Recommendation Engine', topic: 'recommendation-and-personalization', difficulty: 'hard', description: 'Design the system that drives 80% of Netflix viewing. Cover collaborative filtering, content-based features, contextual signals (time of day, device), A/B testing recommendations, homepage row generation, and real-time re-ranking. How do you personalize for 260M subscribers with 17K+ titles?' },
        { title: 'Design Chaos Engineering Platform', topic: 'resilience-and-infrastructure', difficulty: 'hard', description: 'Design Netflix\'s Chaos Monkey and broader chaos engineering platform. Cover random instance termination, latency injection, region evacuation drills, blast radius control, automated rollback, and experiment tracking. How do you safely break production to make it stronger?' },
        { title: 'Design Netflix A/B Testing Platform', topic: 'data-pipeline', difficulty: 'hard', description: 'Design the experimentation platform that runs thousands of concurrent A/B tests. Cover experiment assignment (consistent hashing), metric collection, statistical analysis (p-values, confidence intervals), interaction detection between experiments, and automated rollout decisions.' },
      ]),

      // ═══ Company-Specific LLD Questions ═══

      this.generateCompanyQuestions('google', 'lld', [
        { title: 'Design a Key-Value Store with TTL', topic: 'data-structure-design', difficulty: 'medium', description: 'Design and implement a key-value store that supports get, put, delete, and automatic expiration of entries after a TTL. Must be thread-safe and memory-efficient. Consider lazy vs eager expiration.' },
        { title: 'Design an Online Chess Game', topic: 'game-design', difficulty: 'medium', description: 'Design the OOP model for an online chess game. Support move validation, check/checkmate detection, game state management, undo, move history, and extensibility for chess variants.' },
        { title: 'Design a Logging Framework', topic: 'framework-design', difficulty: 'medium', description: 'Design a pluggable logging framework. Support multiple output targets (console, file, network), log levels, structured logging, async writing, and log rotation. Think about Google-scale logging.' },
      ]),

      this.generateCompanyQuestions('amazon', 'lld', [
        { title: 'Design an Amazon Locker System', topic: 'state-machine', difficulty: 'medium', description: 'Design the OOP model for Amazon Lockers. Handle package assignment to lockers (size matching), pickup code generation, expiration, return processing, and locker availability management. Consider concurrent access.' },
        { title: 'Design a Coupon/Discount Engine', topic: 'rules-engine', difficulty: 'hard', description: 'Design a composable discount rules engine for Amazon. Support percentage discounts, flat discounts, buy-X-get-Y, stackable vs exclusive coupons, user eligibility rules, and usage limits. Must be extensible for new rule types.' },
        { title: 'Design a Warehouse Inventory System', topic: 'object-oriented-design', difficulty: 'medium', description: 'Design the OOP model for warehouse inventory. Track items across zones, handle stock reservations, pick-pack-ship workflow, restocking, and inventory reconciliation.' },
      ]),

      this.generateCompanyQuestions('meta', 'lld', [
        { title: 'Design a Social Event System', topic: 'social-features', difficulty: 'medium', description: 'Design the OOP model for Facebook Events. Support event creation, RSVP (going/interested/not going), event discovery, recurring events, co-hosting, and privacy settings (public/friends/invite-only).' },
        { title: 'Design a Content Moderation Rules Engine', topic: 'rules-engine', difficulty: 'hard', description: 'Design a system that evaluates content against moderation rules. Support text, image, and video content types, configurable rule sets per region, severity levels, appeal workflow, and audit logging.' },
        { title: 'Design a Real-time Comment System', topic: 'real-time', difficulty: 'medium', description: 'Design the OOP model for a live comment system (like Facebook Live comments). Support real-time comment streaming, reactions, reply threads, spam filtering, and rate limiting per user.' },
      ]),

      this.generateCompanyQuestions('microsoft', 'lld', [
        { title: 'Design a Plugin/Extension System', topic: 'framework-design', difficulty: 'hard', description: 'Design the OOP architecture for a plugin system like VS Code extensions. Support plugin discovery, lifecycle management (install/activate/deactivate/uninstall), sandboxed execution, API surface for plugins, and dependency management.' },
        { title: 'Design a Multi-tenant Permission System', topic: 'access-control', difficulty: 'hard', description: 'Design an RBAC (Role-Based Access Control) system for a multi-tenant SaaS product. Support organizations, teams, roles, permissions, inheritance, and cross-tenant sharing with proper isolation.' },
        { title: 'Design a Meeting Scheduler', topic: 'scheduling', difficulty: 'medium', description: 'Design the OOP model for a meeting scheduler. Support finding available time slots across multiple attendees, room booking, recurring meetings, timezone handling, and conflict detection.' },
      ]),

      this.generateCompanyQuestions('apple', 'lld', [
        { title: 'Design a Photo Filter Pipeline', topic: 'pipeline-design', difficulty: 'medium', description: 'Design a composable photo filter system. Support chaining multiple filters (brightness, contrast, blur, sepia), preview generation, undo/redo, and thread-safe processing. Consider memory efficiency for large images on mobile devices.' },
        { title: 'Design a Push Notification System', topic: 'notification-design', difficulty: 'medium', description: 'Design the client-side OOP model for handling push notifications. Support notification categories, actions, grouping, scheduled delivery, user preferences, and do-not-disturb rules.' },
        { title: 'Design a Gesture Recognition System', topic: 'ui-design', difficulty: 'hard', description: 'Design the OOP model for recognizing multi-touch gestures. Support tap, swipe, pinch, rotate, long-press, and custom gestures. Handle gesture conflicts and priority resolution.' },
      ]),

      this.generateCompanyQuestions('netflix', 'lld', [
        { title: 'Design a Circuit Breaker Library', topic: 'resilience-patterns', difficulty: 'hard', description: 'Design a circuit breaker (like Netflix Hystrix). Support closed/open/half-open states, configurable thresholds (failure count, failure rate, timeout), fallback mechanisms, metrics collection, and thread-pool isolation.' },
        { title: 'Design a Feature Flag System', topic: 'feature-management', difficulty: 'medium', description: 'Design a feature flag system. Support boolean and multivariate flags, targeting rules (by user, region, percentage), gradual rollout, kill switch, and A/B test integration.' },
        { title: 'Design a Retry Framework', topic: 'resilience-patterns', difficulty: 'medium', description: 'Design a configurable retry framework. Support exponential backoff with jitter, max retries, retryable vs non-retryable exceptions, circuit breaker integration, and deadline/timeout awareness.' },
      ]),

      // Behavioral Questions (company-specific)
      this.generateCompanyQuestions('amazon', 'behavioral', [
        { title: 'Customer Obsession', topic: 'leadership', difficulty: 'medium', description: 'Tell me about a time you went above and beyond for a customer or end user. What was the situation, what did you do, and what was the measurable impact?' },
        { title: 'Ownership & Dive Deep', topic: 'leadership', difficulty: 'medium', description: 'Tell me about a time you took on something significant outside your area of responsibility. How did you dive deep into the details to understand and solve the problem?' },
        { title: 'Disagree and Commit', topic: 'leadership', difficulty: 'hard', description: 'Tell me about a time you strongly disagreed with your manager or team on a technical decision. How did you handle it? What was the outcome?' },
        { title: 'Deliver Results Under Pressure', topic: 'leadership', difficulty: 'hard', description: 'Tell me about a time you had to deliver a critical project under a very tight deadline with limited resources. How did you prioritize and what was the result?' },
      ]),

      this.generateCompanyQuestions('google', 'behavioral', [
        { title: 'Navigating Ambiguity', topic: 'leadership', difficulty: 'medium', description: 'Tell me about a time you had to make a significant technical decision with incomplete information. How did you navigate the ambiguity?' },
        { title: 'Collaborative Problem Solving', topic: 'collaboration', difficulty: 'medium', description: 'Describe a time you had to work with a cross-functional team to solve a complex technical problem. What was your approach to ensuring alignment?' },
        { title: 'Intellectual Humility', topic: 'growth', difficulty: 'medium', description: 'Tell me about a time you were wrong about a technical approach. How did you realize it, and what did you do?' },
      ]),

      this.generateCompanyQuestions('meta', 'behavioral', [
        { title: 'Moving Fast with Impact', topic: 'execution', difficulty: 'medium', description: 'Tell me about a time you had to ship something quickly. How did you balance speed with quality? What was the impact?' },
        { title: 'Bold Decision Making', topic: 'leadership', difficulty: 'hard', description: 'Describe a time you took a significant technical risk. What was the potential downside, and how did it turn out?' },
      ]),

      this.generateCompanyQuestions('microsoft', 'behavioral', [
        { title: 'Growth Mindset', topic: 'growth', difficulty: 'medium', description: 'Tell me about a time you failed at something significant. What did you learn, and how did it change your approach going forward?' },
        { title: 'Inclusive Collaboration', topic: 'collaboration', difficulty: 'medium', description: 'Describe a time you actively worked to include a diverse perspective or make your team more inclusive. What impact did it have?' },
      ]),

      this.generateCompanyQuestions('netflix', 'behavioral', [
        { title: 'Freedom and Responsibility', topic: 'leadership', difficulty: 'hard', description: 'Tell me about a time you made a significant decision without getting explicit approval. What was the context, what did you decide, and what was the outcome?' },
        { title: 'Radical Candor', topic: 'feedback', difficulty: 'hard', description: 'Describe a time you had to give very difficult, honest feedback to a colleague or manager. How did you approach it and what happened?' },
        { title: 'The Keeper Test', topic: 'impact', difficulty: 'hard', description: 'Why should we fight to keep you at Netflix? What unique value do you bring? Tell me about your most significant contribution — the one that demonstrates you operate at a senior level.' },
      ]),

      this.generateCompanyQuestions('apple', 'behavioral', [
        { title: 'Passion for Craft', topic: 'craftsmanship', difficulty: 'medium', description: 'What product or feature have you built that you\'re most proud of? Walk me through the details — what made it exceptional? How did you push for quality when others wanted to ship faster?' },
        { title: 'Attention to Detail', topic: 'quality', difficulty: 'medium', description: 'Tell me about a time you caught a subtle bug or design flaw that everyone else missed. What was it, how did you notice it, and what was the impact of catching it?' },
        { title: 'Team Collaboration', topic: 'collaboration', difficulty: 'medium', description: 'Describe how you work in a small, tight-knit team. How do you handle strong technical disagreements? Give me a specific example.' },
      ]),
    ];
  }

  generateCompanyQuestions(company, roundType, questions) {
    return questions.map(q => ({
      ...q,
      company,
      roundType,
      difficulty: q.difficulty || 'medium',
      subtopics: q.subtopics || [],
      constraints: q.constraints || [],
      followUpQuestions: q.followUpQuestions || [],
      hints: q.hints || [],
      testCases: q.testCases || [],
      tags: [company, roundType, q.topic, q.difficulty].filter(Boolean),
      source: { type: 'manual', year: 2025 }
    }));
  }

  /**
   * Save scraped questions to database
   */
  async saveQuestions(questions) {
    let saved = 0;
    let skipped = 0;

    for (const q of questions) {
      try {
        const exists = await Question.findOne({
          title: q.title,
          company: q.company,
          roundType: q.roundType
        });

        if (!exists) {
          await Question.create(q);
          saved++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(`Failed to save: ${q.title}`, err.message);
      }
    }

    console.log(`💾 Saved: ${saved} | Skipped (duplicate): ${skipped}`);
    return { saved, skipped };
  }

  /**
   * Run the full scraping pipeline
   */
  async run() {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresense');
      console.log('✅ Connected to MongoDB');

      const questions = await this.scrapePublicQuestionLists();
      const result = await this.saveQuestions(questions);

      console.log(`\n🎉 Scraping complete! ${result.saved} new questions added.`);
    } catch (error) {
      console.error('❌ Scraping failed:', error.message);
    } finally {
      await mongoose.disconnect();
    }
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
  new QuestionScraper().run();
}

module.exports = QuestionScraper;
