const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
// Fallback to .env.example if .env doesn't set values
if (!process.env.JWT_SECRET) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env.example') });
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const dashboardRoutes = require('./routes/dashboard');
const questionRoutes = require('./routes/questions');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: isProd ? true : (process.env.CLIENT_URL || 'http://localhost:3000'),
  credentials: true
}));
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/questions', questionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: isProd ? 'production' : 'development' });
});

// Production: serve React build as static files
if (isProd) {
  const clientBuild = path.join(__dirname, '../../client/build');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server — connect to DB first, then listen
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 HireSense AI Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
