const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Vercel!', 
    status: 'working',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Minimal server working',
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;
