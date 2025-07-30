const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import auth routes only
const authRoutes = require('./routes/auth');

const app = express();

// Basic CORS middleware - Allow all origins for demo
app.use(cors({
  origin: true,  // Allow all origins
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Meat Market API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    routes: {
      auth: 'enabled',
      data: 'enabled', 
      analytics: 'enabled'
    }
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

// Demo data endpoint for dashboard
app.get('/api/data', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  // Sample data for demo
  const sampleData = [
    {
      _id: '1',
      productName: 'Beef',
      area: 'Dhaka',
      quantity: 100,
      pricePerUnit: 450,
      totalSellingPrice: 45000,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2', 
      productName: 'Chicken',
      area: 'Chittagong',
      quantity: 200,
      pricePerUnit: 200,
      totalSellingPrice: 40000,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      productName: 'Mutton',
      area: 'Sylhet', 
      quantity: 50,
      pricePerUnit: 650,
      totalSellingPrice: 32500,
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    data: sampleData,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Demo analytics endpoint for dashboard
app.get('/api/analytics/dashboard', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  // Sample analytics data for demo - formatted to match frontend expectations
  res.json({
    summary: {
      totalEntries: 3,
      totalSupply: 350,
      avgPrice: 433.33,
      totalMarketValue: 117500,
      avgSellingPrice: 39166.67,
      productTypes: 3
    },
    monthlyTrends: [
      { month: 'Jan', supply: 300, avgPrice: 400 },
      { month: 'Feb', supply: 350, avgPrice: 420 },
      { month: 'Mar', supply: 380, avgPrice: 450 }
    ],
    areaDistribution: [
      { area: 'Dhaka', count: 1, percentage: 33.3 },
      { area: 'Chittagong', count: 1, percentage: 33.3 },
      { area: 'Sylhet', count: 1, percentage: 33.3 }
    ],
    productDistribution: [
      { product: 'Beef', count: 1, percentage: 33.3 },
      { product: 'Chicken', count: 1, percentage: 33.3 },
      { product: 'Mutton', count: 1, percentage: 33.3 }
    ],
    recentEntries: [
      {
        _id: '1',
        productName: 'Beef',
        area: 'Dhaka',
        quantity: 100,
        pricePerUnit: 450,
        totalSellingPrice: 45000,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2', 
        productName: 'Chicken',
        area: 'Chittagong',
        quantity: 200,
        pricePerUnit: 200,
        totalSellingPrice: 40000,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        productName: 'Mutton',
        area: 'Sylhet', 
        quantity: 50,
        pricePerUnit: 650,
        totalSellingPrice: 32500,
        createdAt: new Date().toISOString()
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel serverless function
module.exports = app;
