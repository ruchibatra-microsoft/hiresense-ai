# 🧠 HireSense AI

**AI-Powered Mock Interview Platform** — Experience FAANG-level interviews with realistic AI interviewers, timed pressure, dynamic follow-ups, and strict hire/no-hire decisions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)

---

## 🎯 What is HireSense AI?

HireSense AI simulates real FAANG-level software engineering interviews. It's not a quiz app — it's a full interview simulation with:

- **Company-specific AI interviewers** (Google, Amazon, Meta, Microsoft, Apple, Netflix)
- **Dynamic conversations** with follow-up questions, probing, and difficulty escalation
- **Timed rounds** with countdown timers and auto-submission
- **Live coding editor** with code submission and review
- **Strict evaluation** with section-wise scoring and hire/no-hire decisions
- **Dashboard analytics** with performance trends and weak topic heatmaps

## 🏢 Supported Companies

| Company | Interview Style | Focus |
|---------|----------------|-------|
| 🔵 Google | Collaborative, depth-focused | Googleyness, problem-solving depth |
| 🟠 Amazon | LP-driven, execution-focused | 16 Leadership Principles, data-driven results |
| 🔷 Microsoft | Growth-mindset, collaborative | Clarity, inclusion, AS-appropriate round |
| 🔵 Meta | Fast-paced, impact-driven | Speed, 2 problems in 45 min, execution |
| ⚫ Apple | Detail-oriented, craft-focused | User experience, edge cases, quality |
| 🔴 Netflix | Senior-level, culture-fit | Freedom & Responsibility, radical candor |

## 🎥 Interview Rounds

- **💻 DSA (Coding)** — Data structures & algorithms with live code editor
- **🏗️ LLD (Low Level Design)** — Object-oriented design, SOLID principles
- **🌐 HLD (System Design)** — Large-scale distributed systems architecture
- **🎯 Behavioral** — Leadership, teamwork, past experience deep dives

## ✨ Key Features

### Realistic Interview Experience
- AI introduces itself, sets expectations, asks clarifying questions
- Interrupts if candidate goes off track
- Asks follow-up questions and probes deeper
- Increases difficulty if candidate performs well
- Pushes for optimization and tradeoffs

### Timed Pressure Environment
- Countdown timer for each round (45-60 minutes)
- 5-minute warning notification
- Auto-submit when time expires
- No pausing allowed

### Strict Evaluation
- Section-wise scoring (0-100)
- Strengths & weaknesses analysis
- Missed opportunities identification
- Red flags detection
- Final decision: **Hire / Lean Hire / No Hire**
- Company-specific evaluation tone

### Dashboard & Analytics
- Interview history with scores
- Company-wise performance comparison
- Round-type performance breakdown
- Weak topic heatmap
- Score improvement trend

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Monaco Editor, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| AI Engine | OpenAI GPT-4 with structured prompt templates |
| Styling | Custom CSS with dark/light theme |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/hiresense-ai.git
cd hiresense-ai

# Install all dependencies
npm run install:all
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI=mongodb://localhost:27017/hiresense
# - OPENAI_API_KEY=your-openai-api-key
# - JWT_SECRET=your-secret-key
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Start Development

```bash
# Start both server and client
npm run dev

# Or separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### 5. Open Browser

Navigate to `http://localhost:3000`

### Docker Alternative

```bash
docker-compose up -d
```

## 📁 Project Structure

```
hiresense-ai/
├── server/
│   └── src/
│       ├── index.js              # Express server entry
│       ├── config/db.js          # MongoDB connection
│       ├── models/               # Mongoose schemas
│       │   ├── User.js
│       │   ├── InterviewSession.js
│       │   └── Question.js
│       ├── routes/               # API routes
│       │   ├── auth.js
│       │   ├── interview.js
│       │   ├── dashboard.js
│       │   └── questions.js
│       ├── services/             # Business logic
│       │   ├── llmService.js     # OpenAI integration
│       │   ├── interviewEngine.js # Interview orchestration
│       │   └── evaluationService.js
│       ├── prompts/              # LLM prompt templates
│       │   ├── companyContext.js  # Deep company profiles
│       │   ├── dsaPrompts.js
│       │   ├── lldPrompts.js
│       │   ├── hldPrompts.js
│       │   ├── behavioralPrompts.js
│       │   └── evaluationPrompts.js
│       ├── scrapers/             # Question scraping
│       │   └── questionScraper.js
│       ├── seed/                 # Database seed data
│       │   └── seedData.js
│       └── middleware/           # Auth, rate limiting
│
├── client/
│   └── src/
│       ├── App.js                # Router & providers
│       ├── pages/                # Page components
│       │   ├── Home.jsx
│       │   ├── CompanyPage.jsx   # Company/round selection
│       │   ├── InterviewPage.jsx # Interview room (chat + editor)
│       │   ├── DashboardPage.jsx # Analytics dashboard
│       │   └── ResultsPage.jsx   # Detailed results view
│       ├── context/              # React context providers
│       │   ├── AuthContext.jsx
│       │   ├── InterviewContext.jsx
│       │   └── ThemeContext.jsx
│       ├── services/api.js       # Axios API client
│       ├── utils/constants.js    # Company/round configs
│       └── styles/globals.css    # Theme & component styles
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interview/companies` | List available companies |
| GET | `/api/interview/companies/:company` | Company details |
| POST | `/api/interview/start` | Start new interview |
| POST | `/api/interview/:sessionId/message` | Send message |
| POST | `/api/interview/:sessionId/code` | Submit code |
| POST | `/api/interview/:sessionId/end` | End interview |
| GET | `/api/interview/:sessionId` | Get session details |
| GET | `/api/interview` | Interview history |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard overview |
| GET | `/api/dashboard/results/:sessionId` | Detailed results |

## 🤖 AI Architecture

### Company Context System
Each company has a deep, detailed context profile including:
- Engineering culture and values
- Interview structure and process
- Round-specific expectations and red flags
- Evaluation rubric and scoring criteria
- Interviewer persona with unique style

### Dynamic Interview Flow
1. **Introduction** — AI introduces itself in company-specific tone
2. **Problem Presentation** — Conversational, not static
3. **Clarification Phase** — AI answers candidate's questions
4. **Solution Development** — Real-time back-and-forth
5. **Follow-up & Probing** — Dynamic based on candidate performance
6. **Difficulty Escalation** — If candidate does well, push harder
7. **Evaluation** — Structured, company-tone feedback

### Context Memory
The AI maintains context throughout the interview:
- Tracks candidate's approach and progress
- Identifies weaknesses to probe
- Adjusts difficulty dynamically
- Remembers all prior answers for follow-ups

## 📊 Database Schema

### User
- Profile, experience level, target companies, preferences

### InterviewSession
- Company, round type, difficulty
- Full message history with metadata
- Code submissions
- Timing (start, end, auto-submit)
- Evaluation scores and decision
- Context memory for dynamic flow

### Question
- Company-tagged, round-typed, difficulty-rated
- Expected approaches and complexity
- Follow-up questions and edge cases
- Test cases and evaluation criteria

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/hiresense |
| `JWT_SECRET` | JWT signing secret | — |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `LLM_MODEL` | GPT model to use | gpt-4 |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

## 📝 License

MIT License — free to use and modify.

---

**Built with 🧠 by HireSense AI** — *Because getting hired shouldn't be a surprise.*
