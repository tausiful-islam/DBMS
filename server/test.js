const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Meat Market API Server', 
    status: 'running', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured'
  });
});

// Test auth route
app.post('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth endpoint working', data: req.body });
});

// Export for Vercel serverless
module.exports = app;
