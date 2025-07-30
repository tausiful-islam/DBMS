const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic CORS middleware
app.use(cors({
  origin: [
    'https://meat-supply-server-qk35ujo6j-tausifs-projects-09c070a6.vercel.app',  // Updated backend domain
    'http://localhost:3000'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Meat Market API Server', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Meat Market API is running',
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;
