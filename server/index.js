const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
// const dataRoutes = require('./routes/data');
// const analyticsRoutes = require('./routes/analytics');

const app = express();

// Basic CORS middleware
app.use(cors({
  origin: [
    'https://meat-supply-server-mxnqggf28-tausifs-projects-09c070a6.vercel.app',  // Backend domain
    'http://localhost:3000',  // Local development
    'https://*.vercel.app'  // Allow all Vercel apps for frontend
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meatmarket', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Simple root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Meat Market API Server', 
    status: 'running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Meat Market API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Demo credentials endpoint
app.get('/api/demo-credentials', (req, res) => {
  res.json({
    message: 'Demo Login Credentials',
    credentials: [
      {
        type: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        role: 'user'
      },
      {
        type: 'Admin User', 
        email: 'mdmasudul1979@gmail.com',
        password: 'admin123',
        role: 'admin'
      }
    ],
    note: 'Use these credentials to test the login functionality'
  });
});

// Demo login endpoint (for testing when MongoDB is down)
app.post('/api/auth/demo-login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo users for testing
  const demoUsers = [
    {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test123',
      role: 'user'
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'mdmasudul1979@gmail.com',
      password: 'admin123',
      role: 'admin'
    }
  ];
  
  const user = demoUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // For demo purposes, return a simple token
  const token = `demo-token-${user.id}-${Date.now()}`;
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;
