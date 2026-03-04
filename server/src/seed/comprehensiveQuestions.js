/**
 * HireSense AI — Comprehensive Question Bank
 * 
 * Sourced from publicly available interview patterns:
 * - Blind 75 (most popular FAANG prep list)
 * - Grind 75 (updated by Blind 75 author)
 * - NeetCode 150 patterns
 * - Publicly discussed company-tagged problems on LeetCode Discuss
 * - Glassdoor public interview reviews (question types, not proprietary content)
 * - System Design interview patterns from public tech blogs
 * - Behavioral patterns from public Leadership Principles documentation
 * 
 * Each question includes:
 * - Company tagging (which companies commonly ask this)
 * - Detailed follow-ups a real interviewer would ask
 * - Expected approach with complexity
 * - Edge cases to probe
 * - What makes this question company-specific
 */

const COMPREHENSIVE_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════
  // DSA — ARRAYS & HASHING (most common topic across all companies)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.',
    company: 'google', roundType: 'dsa', difficulty: 'easy', topic: 'arrays',
    subtopics: ['hash-map', 'brute-force'],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists'],
    followUpQuestions: ['What if there are multiple pairs?', 'What if the array is sorted — can you do O(n)?', 'What about a stream of numbers?', 'What if you need all unique pairs?'],
    expectedApproach: { bruteForce: 'Two nested loops checking all pairs — O(n²)', optimal: 'Hash map: for each num, check if target-num exists in map — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    testCases: [{ input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0,1]', isEdgeCase: false }, { input: 'nums=[3,3], target=6', expectedOutput: '[0,1]', isEdgeCase: true }, { input: 'nums=[-1,-2,-3,-4,-5], target=-8', expectedOutput: '[2,4]', isEdgeCase: true }],
    tags: ['google', 'amazon', 'meta', 'microsoft', 'blind-75', 'grind-75', 'arrays'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Product of Array Except Self',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. You must solve it WITHOUT using division and in O(n) time.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'arrays',
    subtopics: ['prefix-product', 'suffix-product'],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Product fits in 32-bit integer'],
    followUpQuestions: ['Can you solve with O(1) extra space (not counting output)?', 'What if the array contains zeros?', 'What if you could use division?'],
    expectedApproach: { bruteForce: 'For each index, multiply all other elements — O(n²)', optimal: 'Prefix and suffix products in two passes — O(n) time, O(1) extra space', timeComplexity: 'O(n)', spaceComplexity: 'O(1) extra' },
    tags: ['amazon', 'meta', 'google', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. The subarray must be contiguous.',
    company: 'microsoft', roundType: 'dsa', difficulty: 'medium', topic: 'arrays',
    subtopics: ['dynamic-programming', 'greedy', 'divide-and-conquer'],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    followUpQuestions: ['Can you do it with divide and conquer? What\'s the complexity?', 'What if you need to return the actual subarray, not just the sum?', 'What if the array is circular?'],
    expectedApproach: { bruteForce: 'Check all subarrays — O(n²)', optimal: 'Kadane\'s algorithm — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    tags: ['microsoft', 'amazon', 'google', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Container With Most Water',
    description: 'Given n non-negative integers a1, a2, ..., an where each represents a point at coordinate (i, ai). n vertical lines are drawn. Find two lines that together with the x-axis forms a container that holds the most water.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'arrays',
    subtopics: ['two-pointers', 'greedy'],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    followUpQuestions: ['Why does the two-pointer approach work? Can you prove it?', 'What about Trapping Rain Water — how is it different?'],
    expectedApproach: { bruteForce: 'Check all pairs — O(n²)', optimal: 'Two pointers from both ends, move the shorter one — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    tags: ['meta', 'google', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: '3Sum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'arrays',
    subtopics: ['two-pointers', 'sorting'],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    followUpQuestions: ['How do you handle duplicates?', 'What about 4Sum? How would you generalize to kSum?', 'Can you solve this without sorting?'],
    expectedApproach: { bruteForce: 'Three nested loops — O(n³)', optimal: 'Sort + fix one element + two pointers — O(n²)', timeComplexity: 'O(n²)', spaceComplexity: 'O(1) or O(n) for sorting' },
    tags: ['meta', 'google', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Group Anagrams',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'strings',
    subtopics: ['hash-map', 'sorting'],
    followUpQuestions: ['What if strings are very long? Is sorting still the best key?', 'Can you use character frequency as key?', 'What about Unicode anagrams?'],
    expectedApproach: { bruteForce: 'Compare every pair — O(n² * k)', optimal: 'Sort each string as key in hash map — O(n * k log k), or use char count tuple — O(n * k)', timeComplexity: 'O(n * k log k)', spaceComplexity: 'O(n * k)' },
    tags: ['amazon', 'meta', 'google', 'blind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Top K Frequent Elements',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'heaps',
    subtopics: ['hash-map', 'bucket-sort', 'quick-select'],
    followUpQuestions: ['Can you do better than O(n log n)?', 'What about bucket sort approach?', 'How would QuickSelect work here?', 'What if this is a stream of data?'],
    expectedApproach: { bruteForce: 'Count + sort — O(n log n)', optimal: 'Count + min-heap of size k — O(n log k), or bucket sort — O(n)', timeComplexity: 'O(n log k) or O(n)', spaceComplexity: 'O(n)' },
    tags: ['amazon', 'meta', 'google', 'blind-75', 'grind-75', 'neetcode-150'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Longest Consecutive Sequence',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'arrays',
    subtopics: ['hash-set', 'union-find'],
    followUpQuestions: ['Why can\'t you sort? What if you could?', 'How do you identify the start of a sequence?', 'Could you use Union-Find?'],
    expectedApproach: { bruteForce: 'Sort and scan — O(n log n)', optimal: 'HashSet: for each num without num-1 in set, count consecutive — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    tags: ['google', 'amazon', 'meta', 'blind-75', 'neetcode-150'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — SLIDING WINDOW (Meta & Google favorite)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'sliding-window',
    subtopics: ['hash-set', 'two-pointers'],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, spaces'],
    followUpQuestions: ['What if the string contains Unicode?', 'What if you need the actual substring?', 'How does your window shrink?'],
    expectedApproach: { bruteForce: 'Check all substrings with set — O(n³)', optimal: 'Sliding window with hash set/map — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(min(n, m)) where m is charset size' },
    tags: ['meta', 'amazon', 'google', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Minimum Window Substring',
    description: 'Given two strings s and t, return the minimum window substring of s that contains every character in t (including duplicates). If there is no such substring, return "".',
    company: 'meta', roundType: 'dsa', difficulty: 'hard', topic: 'sliding-window',
    subtopics: ['hash-map', 'two-pointers'],
    followUpQuestions: ['What if t has duplicate characters?', 'Can you optimize the window shrinking?', 'What\'s the difference between this and "longest substring with at most K distinct"?'],
    expectedApproach: { bruteForce: 'Check all substrings — O(n² * m)', optimal: 'Sliding window with char frequency maps — O(n + m)', timeComplexity: 'O(n + m)', spaceComplexity: 'O(n + m)' },
    tags: ['meta', 'google', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Find All Anagrams in a String',
    description: 'Given two strings s and p, return an array of all the start indices of p\'s anagrams in s. You may return the answer in any order.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'sliding-window',
    subtopics: ['hash-map', 'fixed-window'],
    followUpQuestions: ['How is this different from Minimum Window Substring?', 'Can you do it with a single frequency array?'],
    expectedApproach: { bruteForce: 'Sort each window and compare — O(n * k log k)', optimal: 'Fixed-size sliding window with char count — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(1) — fixed 26 chars' },
    tags: ['meta', 'amazon', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — TREES (Google & Microsoft favorite)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    company: 'microsoft', roundType: 'dsa', difficulty: 'medium', topic: 'trees',
    subtopics: ['bfs', 'queue'],
    followUpQuestions: ['What about zigzag level order?', 'What about bottom-up level order?', 'Can you do it with DFS?'],
    expectedApproach: { bruteForce: 'N/A', optimal: 'BFS with queue, track level boundaries — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    tags: ['microsoft', 'amazon', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Validate Binary Search Tree',
    description: 'Given the root of a binary tree, determine if it is a valid BST. A valid BST: left subtree contains only nodes with keys less than the node\'s key, right subtree contains only nodes with keys greater than the node\'s key.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'trees',
    subtopics: ['dfs', 'recursion', 'inorder-traversal'],
    followUpQuestions: ['What\'s wrong with just checking node.left < node < node.right?', 'Can you do it with inorder traversal?', 'What about iterative approach?'],
    expectedApproach: { bruteForce: 'Check each node against all ancestors', optimal: 'DFS with min/max bounds — O(n), or inorder traversal checking ascending', timeComplexity: 'O(n)', spaceComplexity: 'O(h) where h is height' },
    tags: ['google', 'microsoft', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. The path sum is the sum of the node values in the path. Return the maximum path sum. The path doesn\'t need to pass through the root.',
    company: 'google', roundType: 'dsa', difficulty: 'hard', topic: 'trees',
    subtopics: ['dfs', 'recursion', 'post-order'],
    followUpQuestions: ['What if the path must start at a leaf?', 'What if all values are negative?', 'How do you handle the "split" at each node?'],
    expectedApproach: { bruteForce: 'Check all paths — O(n²)', optimal: 'Post-order DFS: at each node, max(left, right, left+right+node, node) — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    tags: ['google', 'meta', 'amazon', 'blind-75', 'neetcode-150'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    description: 'Design an algorithm to serialize and deserialize a binary tree. Serialization is converting a tree to a string. Deserialization is reconstructing the tree from the string.',
    company: 'microsoft', roundType: 'dsa', difficulty: 'hard', topic: 'trees',
    subtopics: ['bfs', 'dfs', 'design'],
    followUpQuestions: ['What format would be most compact?', 'BFS vs DFS — which is better for serialization?', 'How do you represent null nodes?'],
    expectedApproach: { bruteForce: 'N/A', optimal: 'Preorder DFS with null markers, or BFS level-by-level — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    tags: ['microsoft', 'google', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Lowest Common Ancestor of a Binary Tree',
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. The LCA is the lowest node that has both p and q as descendants.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'trees',
    subtopics: ['dfs', 'recursion'],
    followUpQuestions: ['What if it\'s a BST?', 'What if nodes have parent pointers?', 'What if one node might not exist in the tree?'],
    expectedApproach: { bruteForce: 'Find paths to both nodes, compare — O(n)', optimal: 'Recursive DFS: if node is p or q, return it; if both subtrees return non-null, current is LCA — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    tags: ['meta', 'google', 'microsoft', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — GRAPHS (Amazon & Google favorite)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'graphs',
    subtopics: ['bfs', 'dfs', 'union-find'],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    followUpQuestions: ['BFS vs DFS — which is better here?', 'Can you solve with Union-Find?', 'What if the grid is too large for recursion (stack overflow)?', 'What about counting distinct island shapes?'],
    expectedApproach: { bruteForce: 'N/A', optimal: 'DFS/BFS marking visited — O(m*n)', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)' },
    tags: ['amazon', 'google', 'meta', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Course Schedule',
    description: 'There are numCourses courses labeled 0 to numCourses-1. Prerequisites[i] = [ai, bi] means you must take bi before ai. Return true if you can finish all courses.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'graphs',
    subtopics: ['topological-sort', 'cycle-detection', 'bfs', 'dfs'],
    followUpQuestions: ['How do you detect a cycle?', 'Can you return the actual ordering (Course Schedule II)?', 'BFS (Kahn\'s) vs DFS — tradeoffs?', 'What if you want minimum semesters (parallel courses)?'],
    expectedApproach: { bruteForce: 'N/A — graph problem', optimal: 'Topological sort via BFS (Kahn\'s) or DFS cycle detection — O(V+E)', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V+E)' },
    tags: ['google', 'amazon', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Clone Graph',
    description: 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph. Each node contains a val and a list of neighbors.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'graphs',
    subtopics: ['bfs', 'dfs', 'hash-map'],
    followUpQuestions: ['How do you handle cycles?', 'BFS vs DFS approach?', 'What data structure maps original to cloned nodes?'],
    expectedApproach: { bruteForce: 'N/A', optimal: 'BFS/DFS with hash map (original → clone) — O(V+E)', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
    tags: ['meta', 'google', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Word Ladder',
    description: 'Given beginWord, endWord, and a dictionary wordList, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time. Each transformed word must exist in the word list.',
    company: 'google', roundType: 'dsa', difficulty: 'hard', topic: 'graphs',
    subtopics: ['bfs', 'string-manipulation'],
    followUpQuestions: ['Why BFS and not DFS?', 'How do you efficiently find neighbors?', 'Can you optimize with bidirectional BFS?', 'What if you need to return all shortest paths?'],
    expectedApproach: { bruteForce: 'DFS trying all paths', optimal: 'BFS from beginWord, each level try all single-char changes — O(M² * N)', timeComplexity: 'O(M² * N) where M = word length, N = list size', spaceComplexity: 'O(M * N)' },
    tags: ['google', 'amazon', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Accounts Merge',
    description: 'Given a list of accounts where each element accounts[i] is a list of strings [name, email1, email2, ...], merge accounts that belong to the same person (share at least one common email).',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'graphs',
    subtopics: ['union-find', 'dfs', 'hash-map'],
    followUpQuestions: ['Why is Union-Find a good fit here?', 'How do you handle the name matching?', 'What\'s the time complexity of your Union-Find approach?'],
    expectedApproach: { bruteForce: 'Compare all pairs — O(n² * k)', optimal: 'Union-Find on emails, then group — O(n * k * α(n))', timeComplexity: 'O(n * k * α(n))', spaceComplexity: 'O(n * k)' },
    tags: ['meta', 'google', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — DYNAMIC PROGRAMMING (Google favorite, harder questions)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Coin Change',
    description: 'Given an integer array coins representing coin denominations and an integer amount, return the fewest number of coins needed to make up that amount. If impossible, return -1.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'dynamic-programming',
    subtopics: ['bottom-up', 'top-down', 'bfs'],
    followUpQuestions: ['Top-down vs bottom-up — which did you choose and why?', 'Can you solve with BFS?', 'What if you need to return the actual coins used?', 'What about Coin Change II (count combinations)?'],
    expectedApproach: { bruteForce: 'Try all combinations recursively — exponential', optimal: 'DP: dp[i] = min coins for amount i — O(amount * coins)', timeComplexity: 'O(amount * n)', spaceComplexity: 'O(amount)' },
    tags: ['google', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Longest Increasing Subsequence',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'dynamic-programming',
    subtopics: ['binary-search', 'patience-sorting'],
    followUpQuestions: ['Can you do better than O(n²)?', 'Explain the binary search approach', 'What if you need the actual subsequence?', 'What about longest non-decreasing?'],
    expectedApproach: { bruteForce: 'Check all subsequences — O(2^n)', optimal: 'DP — O(n²), or binary search with patience sorting — O(n log n)', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
    tags: ['google', 'amazon', 'microsoft', 'blind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Word Break',
    description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'dynamic-programming',
    subtopics: ['trie', 'bfs', 'memoization'],
    followUpQuestions: ['What if you need all possible segmentations (Word Break II)?', 'Can you solve with a Trie?', 'What about BFS approach?'],
    expectedApproach: { bruteForce: 'Try all splits recursively — exponential', optimal: 'DP: dp[i] = true if s[0:i] can be segmented — O(n² * m)', timeComplexity: 'O(n² * m)', spaceComplexity: 'O(n)' },
    tags: ['amazon', 'google', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    company: 'google', roundType: 'dsa', difficulty: 'hard', topic: 'arrays',
    subtopics: ['two-pointers', 'stack', 'dynamic-programming'],
    followUpQuestions: ['Can you solve with O(1) space?', 'How does the two-pointer approach work?', 'Stack-based approach?', 'How is this related to Container With Most Water?'],
    expectedApproach: { bruteForce: 'For each bar, find max left and max right — O(n²)', optimal: 'Two pointers from both ends — O(n) time, O(1) space', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    tags: ['google', 'amazon', 'meta', 'grind-75', 'neetcode-150'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — LINKED LISTS (Microsoft favorite)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    company: 'amazon', roundType: 'dsa', difficulty: 'hard', topic: 'linked-lists',
    subtopics: ['heap', 'divide-and-conquer', 'merge-sort'],
    followUpQuestions: ['Min-heap vs divide-and-conquer — tradeoffs?', 'What if lists are very uneven in size?', 'Can you merge in-place?'],
    expectedApproach: { bruteForce: 'Collect all values, sort, create new list — O(N log N)', optimal: 'Min-heap of k elements — O(N log k)', timeComplexity: 'O(N log k)', spaceComplexity: 'O(k)' },
    tags: ['amazon', 'google', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'LRU Cache',
    description: 'Design a data structure that follows LRU (Least Recently Used) cache constraints. Implement get(key) and put(key, value) operations in O(1) time.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'design',
    subtopics: ['hash-map', 'doubly-linked-list'],
    followUpQuestions: ['Why doubly-linked list and not singly-linked?', 'What if capacity is 0?', 'How would you make this thread-safe?', 'What about LFU cache?'],
    expectedApproach: { bruteForce: 'Array with timestamps — O(n) per operation', optimal: 'Hash map + doubly linked list — O(1) for both get and put', timeComplexity: 'O(1)', spaceComplexity: 'O(capacity)' },
    tags: ['amazon', 'meta', 'google', 'microsoft', 'netflix', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    company: 'microsoft', roundType: 'dsa', difficulty: 'easy', topic: 'linked-lists',
    subtopics: ['pointers', 'recursion'],
    followUpQuestions: ['Iterative vs recursive — can you do both?', 'What about reversing only a portion (left to right)?', 'What about reversing in groups of k?'],
    expectedApproach: { bruteForce: 'Collect to array, reverse, build new list — O(n)', optimal: 'Three pointers (prev, curr, next) — O(n) time, O(1) space', timeComplexity: 'O(n)', spaceComplexity: 'O(1) iterative, O(n) recursive' },
    tags: ['microsoft', 'amazon', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Find Median from Data Stream',
    description: 'The MedianFinder class supports addNum(num) to add an integer and findMedian() to return the median of all elements so far.',
    company: 'google', roundType: 'dsa', difficulty: 'hard', topic: 'heaps',
    subtopics: ['two-heaps', 'balanced-bst'],
    followUpQuestions: ['Why two heaps?', 'What if numbers are in range [0, 100]? Can you optimize?', 'What about a stream with deletions?'],
    expectedApproach: { bruteForce: 'Sort on every findMedian call — O(n log n)', optimal: 'Two heaps (max-heap for lower half, min-heap for upper half) — O(log n) add, O(1) find', timeComplexity: 'O(log n) add, O(1) find', spaceComplexity: 'O(n)' },
    tags: ['google', 'amazon', 'meta', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — BINARY SEARCH (Meta & Google)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Search in Rotated Sorted Array',
    description: 'An integer array nums sorted in ascending order is rotated at an unknown pivot. Given target, return its index, or -1 if not found. You must achieve O(log n).',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'binary-search',
    subtopics: ['modified-binary-search'],
    followUpQuestions: ['What if there are duplicates?', 'How do you determine which half is sorted?', 'Can you find the rotation point first?'],
    expectedApproach: { bruteForce: 'Linear scan — O(n)', optimal: 'Modified binary search — determine which half is sorted — O(log n)', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
    tags: ['meta', 'google', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Time Based Key-Value Store',
    description: 'Design a key-value store where each key\'s value is associated with a timestamp. Support set(key, value, timestamp) and get(key, timestamp) — return the value with the largest timestamp <= given timestamp.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'binary-search',
    subtopics: ['hash-map', 'sorted-list'],
    followUpQuestions: ['Why binary search on timestamps?', 'What if timestamps are not strictly increasing?', 'How would you handle deletions?'],
    expectedApproach: { bruteForce: 'Linear scan through all timestamps — O(n)', optimal: 'Hash map + binary search on sorted timestamp list — O(log n) get', timeComplexity: 'O(1) set, O(log n) get', spaceComplexity: 'O(n)' },
    tags: ['google', 'amazon', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — BACKTRACKING (Google & Amazon)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Permutations',
    description: 'Given an array nums of distinct integers, return all possible permutations. You can return the answer in any order.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'backtracking',
    subtopics: ['recursion', 'swapping'],
    followUpQuestions: ['What if nums has duplicates (Permutations II)?', 'Can you generate permutations iteratively?', 'How many permutations are there?'],
    expectedApproach: { bruteForce: 'N/A — backtracking is the approach', optimal: 'Backtracking: fix one element, recurse on rest — O(n! * n)', timeComplexity: 'O(n! * n)', spaceComplexity: 'O(n)' },
    tags: ['google', 'meta', 'amazon', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Combination Sum',
    description: 'Given an array of distinct integers candidates and a target, return all unique combinations of candidates where the chosen numbers sum to target. The same number may be used unlimited times.',
    company: 'amazon', roundType: 'dsa', difficulty: 'medium', topic: 'backtracking',
    subtopics: ['recursion', 'pruning'],
    followUpQuestions: ['What if each number can only be used once (Combination Sum II)?', 'How do you avoid duplicate combinations?', 'What\'s the time complexity?'],
    expectedApproach: { bruteForce: 'Try all subsets', optimal: 'Backtracking with sorting + pruning — no duplicate branches', timeComplexity: 'O(2^t) where t = target/min(candidates)', spaceComplexity: 'O(target/min)' },
    tags: ['amazon', 'google', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — TRIES (Google & Amazon)
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Implement Trie (Prefix Tree)',
    description: 'Implement a trie with insert, search, and startsWith methods.',
    company: 'google', roundType: 'dsa', difficulty: 'medium', topic: 'tries',
    subtopics: ['tree', 'string'],
    followUpQuestions: ['How would you implement delete?', 'What about autocomplete (return all words with prefix)?', 'How does memory usage compare to a hash map?', 'What about a compressed trie (radix tree)?'],
    expectedApproach: { bruteForce: 'Hash set of all prefixes — O(n²) space', optimal: 'Trie node with children array/map — O(m) per operation where m = word length', timeComplexity: 'O(m) per operation', spaceComplexity: 'O(ALPHABET * m * n)' },
    tags: ['google', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Word Search II',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from adjacent cells (no cell reused per word).',
    company: 'amazon', roundType: 'dsa', difficulty: 'hard', topic: 'tries',
    subtopics: ['backtracking', 'dfs'],
    followUpQuestions: ['Why is a Trie better than searching each word individually?', 'How do you prune the Trie during search?', 'What\'s the time complexity?'],
    expectedApproach: { bruteForce: 'For each word, DFS from each cell — O(words * m * n * 4^L)', optimal: 'Build Trie of words, DFS from each cell matching Trie — O(m * n * 4^L)', timeComplexity: 'O(m * n * 4^L)', spaceComplexity: 'O(total chars in words)' },
    tags: ['amazon', 'google', 'blind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DSA — STACK & INTERVALS
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    company: 'meta', roundType: 'dsa', difficulty: 'easy', topic: 'stacks',
    subtopics: ['string'],
    followUpQuestions: ['What if you only have one type of bracket?', 'What about minimum removes to make valid?'],
    expectedApproach: { bruteForce: 'Replace matched pairs repeatedly', optimal: 'Stack: push opens, pop on close and check match — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    tags: ['meta', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'intervals',
    subtopics: ['sorting'],
    followUpQuestions: ['What if the intervals are already sorted?', 'What about Insert Interval?', 'How would you handle this with a stream of intervals?'],
    expectedApproach: { bruteForce: 'Compare all pairs — O(n²)', optimal: 'Sort by start, then merge in one pass — O(n log n)', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
    tags: ['meta', 'google', 'amazon', 'microsoft', 'blind-75', 'grind-75'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Task Scheduler',
    description: 'Given a char array tasks representing CPU tasks (A-Z) and a cooldown period n, find the minimum number of intervals the CPU will take to finish all tasks. Same tasks must be separated by at least n intervals.',
    company: 'meta', roundType: 'dsa', difficulty: 'medium', topic: 'heaps',
    subtopics: ['greedy', 'math'],
    followUpQuestions: ['Can you solve this without simulation?', 'What\'s the math formula approach?', 'What if tasks have priorities?'],
    expectedApproach: { bruteForce: 'Simulate with queue', optimal: 'Greedy: schedule most frequent first, or math formula — O(n)', timeComplexity: 'O(n)', spaceComplexity: 'O(1) — 26 chars max' },
    tags: ['meta', 'amazon', 'grind-75'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // SYSTEM DESIGN — from public tech blog discussions
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Design a Distributed Cache (Redis-like)',
    description: 'Design a distributed caching system. Support get/set with TTL, eviction policies (LRU, LFU), sharding across nodes, replication for availability, and consistent hashing for node addition/removal. Handle cache stampede and thundering herd problems.',
    company: 'amazon', roundType: 'hld', difficulty: 'hard', topic: 'infrastructure',
    subtopics: ['consistent-hashing', 'replication', 'eviction'],
    followUpQuestions: ['How does consistent hashing minimize key redistribution?', 'LRU vs LFU — when to use which?', 'How do you handle a cache stampede?', 'What about cache-aside vs write-through vs write-behind patterns?'],
    tags: ['amazon', 'google', 'netflix', 'hld'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Web Crawler',
    description: 'Design a web crawler that crawls billions of web pages. Handle URL frontier, politeness (don\'t DDoS sites), deduplication, distributed crawling across multiple machines, and handling dynamic JavaScript content.',
    company: 'google', roundType: 'hld', difficulty: 'hard', topic: 'infrastructure',
    subtopics: ['distributed-systems', 'queue', 'deduplication'],
    followUpQuestions: ['How do you prioritize which URLs to crawl first?', 'How do you handle infinite loops (same page, different URL)?', 'How do you respect robots.txt?', 'How do you handle JavaScript-rendered content?'],
    tags: ['google', 'hld'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Notification System',
    description: 'Design a notification system that supports push notifications, SMS, email, and in-app notifications. Handle user preferences, rate limiting, template management, delivery tracking, and multi-channel delivery. Scale to billions of notifications per day.',
    company: 'meta', roundType: 'hld', difficulty: 'medium', topic: 'messaging',
    subtopics: ['event-driven', 'queue', 'template-engine'],
    followUpQuestions: ['How do you prevent notification fatigue?', 'How do you handle delivery failures and retries?', 'What about priority notifications (security alerts)?', 'How do you track delivery and read status?'],
    tags: ['meta', 'amazon', 'google', 'hld'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Ride-Sharing Service (Uber/Lyft)',
    description: 'Design a ride-sharing service. Core features: rider requests ride, system matches with nearby driver, real-time location tracking, ETA calculation, pricing, payment processing, trip history.',
    company: 'amazon', roundType: 'hld', difficulty: 'hard', topic: 'location-services',
    subtopics: ['geospatial-indexing', 'real-time', 'matching'],
    followUpQuestions: ['How do you find nearby drivers efficiently? (Geohash vs QuadTree)', 'How do you handle surge pricing?', 'How does the matching algorithm work?', 'How do you handle driver/rider cancellations?'],
    tags: ['amazon', 'google', 'hld'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Design a Search Autocomplete System',
    description: 'Design a typeahead/autocomplete system for a search engine. As the user types each character, suggest the top K most relevant/popular completions. Handle billions of queries, real-time updating, personalization, and trending queries.',
    company: 'google', roundType: 'hld', difficulty: 'hard', topic: 'search',
    subtopics: ['trie', 'caching', 'ranking'],
    followUpQuestions: ['Trie vs precomputed results — tradeoffs?', 'How do you update frequency counts in real-time?', 'How do you handle personalization?', 'What about offensive content filtering?'],
    tags: ['google', 'meta', 'amazon', 'hld'], source: { type: 'manual', year: 2025 }
  },

  // ═══════════════════════════════════════════════════════════════
  // BEHAVIORAL — from Glassdoor public reviews & LP frameworks
  // ═══════════════════════════════════════════════════════════════

  {
    title: 'Bias for Action — Calculated Risk',
    description: 'Tell me about a time you took a calculated risk. What was the situation? What information did you have, and what was missing? How did you decide to act, and what was the outcome?',
    company: 'amazon', roundType: 'behavioral', difficulty: 'medium', topic: 'leadership',
    followUpQuestions: ['What data did you use to calculate the risk?', 'What was the worst-case scenario?', 'How did your manager react?', 'Would you do it again?'],
    tags: ['amazon', 'behavioral', 'bias-for-action'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Earn Trust — Delivering Bad News',
    description: 'Tell me about a time you had to deliver difficult or bad news to a team, stakeholder, or customer. How did you prepare? How did they react? What was the result?',
    company: 'amazon', roundType: 'behavioral', difficulty: 'hard', topic: 'communication',
    followUpQuestions: ['How did you prepare for the conversation?', 'What alternatives did you present?', 'How did you maintain the relationship afterward?'],
    tags: ['amazon', 'behavioral', 'earn-trust'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Driving Technical Excellence',
    description: 'Tell me about a time you raised the technical bar for your team. Maybe you introduced a new practice, tool, or standard that improved quality. What resistance did you face?',
    company: 'google', roundType: 'behavioral', difficulty: 'medium', topic: 'technical-leadership',
    followUpQuestions: ['How did you measure the improvement?', 'Who opposed the change and why?', 'How did you get buy-in?', 'What would you do differently?'],
    tags: ['google', 'microsoft', 'behavioral', 'technical-leadership'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Shipping Under Constraints',
    description: 'Tell me about a time you had to ship a product or feature with significant constraints — tight deadline, limited team, unclear requirements, or technical debt. How did you prioritize? What did you cut?',
    company: 'meta', roundType: 'behavioral', difficulty: 'medium', topic: 'execution',
    followUpQuestions: ['How did you decide what to cut?', 'What was the impact on users?', 'What shortcuts did you take and were they worth it?', 'How did you handle quality with the time pressure?'],
    tags: ['meta', 'amazon', 'behavioral', 'execution'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Learning from Failure',
    description: 'Tell me about a significant failure in your career. What happened? What was your role in it? What did you learn, and how did it change your approach going forward?',
    company: 'microsoft', roundType: 'behavioral', difficulty: 'medium', topic: 'growth-mindset',
    followUpQuestions: ['What was the root cause?', 'How did you communicate the failure to stakeholders?', 'What systems did you put in place to prevent it from happening again?', 'How did this experience change you as an engineer?'],
    tags: ['microsoft', 'google', 'behavioral', 'growth-mindset'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Cross-Team Collaboration',
    description: 'Describe a project where you had to work closely with another team (or teams) that had different priorities or technical approaches. How did you align, resolve conflicts, and deliver together?',
    company: 'microsoft', roundType: 'behavioral', difficulty: 'medium', topic: 'collaboration',
    followUpQuestions: ['How did you handle the priority mismatch?', 'What was the communication mechanism?', 'How did you build trust with the other team?', 'What was the outcome?'],
    tags: ['microsoft', 'google', 'apple', 'behavioral', 'collaboration'], source: { type: 'manual', year: 2025 }
  },
  {
    title: 'Autonomous Decision Making',
    description: 'Tell me about a time you made a significant technical or product decision without waiting for explicit approval from your manager. What was the context? Why did you act? What happened?',
    company: 'netflix', roundType: 'behavioral', difficulty: 'hard', topic: 'autonomy',
    followUpQuestions: ['What was at stake if you waited?', 'How did your manager respond?', 'Was the decision right?', 'What would you do if the decision was wrong?'],
    tags: ['netflix', 'behavioral', 'freedom-and-responsibility'], source: { type: 'manual', year: 2025 }
  }
];

module.exports = COMPREHENSIVE_QUESTIONS;
