# Development Guide - Meat Market Platform

## 🏗️ Project Structure

```
DataBase_Project/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # File uploads
│   ├── seed.js           # Database seeding
│   ├── package.json
│   └── ...
├── package.json          # Root package.json
├── README.md
└── setup.sh             # Setup script
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### 2. Installation
```bash
# Clone and setup
git clone <repo-url>
cd DataBase_Project

# Run setup script
./setup.sh

# Or manually:
npm run install-deps
```

### 3. Environment Setup
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/meatmarket
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
```

### 4. Seed Database (Optional)
```bash
cd server
npm run seed
```

### 5. Start Development
```bash
# Start both client and server
npm run dev

# Or separately:
npm run server  # Backend on :5000
npm run client  # Frontend on :3000
```

## 🧪 Development Workflow

### Adding New Features

#### 1. Backend API Endpoint
```javascript
// server/routes/example.js
const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/endpoint', auth, async (req, res) => {
  try {
    // Your logic here
    res.json({ data: 'example' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

#### 2. Frontend Service
```javascript
// client/src/services/exampleService.js
import api from './api';

export const exampleService = {
  getData: async () => {
    const response = await api.get('/example/endpoint');
    return response.data;
  },
};
```

#### 3. React Component
```javascript
// client/src/components/ExampleComponent.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { exampleService } from '../services/exampleService';

const ExampleComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['example'],
    queryFn: exampleService.getData,
  });

  if (isLoading) return <div>Loading...</div>;
  
  return <div>{data}</div>;
};

export default ExampleComponent;
```

### Database Models

#### Creating New Models
```javascript
// server/models/Example.js
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // ... other fields
}, {
  timestamps: true
});

module.exports = mongoose.model('Example', exampleSchema);
```

### Authentication & Authorization

#### Protected Routes
```javascript
// Backend
router.get('/protected', auth, (req, res) => {
  // req.user is available
});

// Admin only
router.delete('/admin-only', auth, adminAuth, (req, res) => {
  // Only admins can access
});
```

#### Frontend Auth Context
```javascript
// Using auth context
const { user, login, logout } = useAuth();

// Protected component
const ProtectedComponent = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  return <div>Protected content</div>;
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```javascript
// Common patterns
const styles = {
  // Buttons
  primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg',
  
  // Cards
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
  
  // Forms
  input: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
};
```

### Dark Mode Support
```javascript
// Use dark: prefix for dark mode styles
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content that adapts to theme
</div>
```

## 📊 Data Visualization

### Adding New Charts
```javascript
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const chartData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Data',
    data: [10, 20, 30],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  }]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
};

<Line data={chartData} options={chartOptions} />
```

## 🔍 Debugging

### Backend Debugging
```javascript
// Add debug logs
console.log('Debug:', variable);

// Error handling
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: error.message });
}
```

### Frontend Debugging
```javascript
// React Query DevTools (already included)
// Check Network tab for API calls
// Use React Developer Tools

// Console debugging
console.log('Component state:', state);
console.log('Props:', props);
```

## 📝 Code Standards

### Backend
- Use async/await for async operations
- Validate input data
- Handle errors properly
- Use meaningful variable names
- Add comments for complex logic

### Frontend
- Use functional components with hooks
- Implement proper loading states
- Handle errors gracefully
- Use TypeScript for better type safety (optional)
- Follow React best practices

## 🧪 Testing

### Backend Testing
```javascript
// Example test structure
const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  test('GET /api/data', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});
```

### Frontend Testing
```javascript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

## 📦 Deployment

### Environment Variables
```bash
# Production environment
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secure_random_string
CLIENT_URL=https://yourdomain.com
```

### Build Process
```bash
# Build frontend
cd client
npm run build

# The build folder contains static files for deployment
```

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes following code standards
3. Test thoroughly
4. Submit pull request with clear description
5. Ensure CI/CD passes

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)

## 🐛 Common Issues

### Database Connection
```bash
# MongoDB not running
brew services start mongodb/brew/mongodb-community

# Connection string issues
# Check MONGODB_URI in .env
```

### Port Conflicts
```bash
# Port 3000 or 5000 in use
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Dependencies
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Happy coding! 🚀**
