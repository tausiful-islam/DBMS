const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    // Handle demo tokens
    if (token.startsWith('demo-token-')) {
      // For demo tokens, create a simple user object
      const userId = token.split('-')[2]; // Extract user id from demo token
      req.user = {
        _id: userId,
        name: userId === '1' ? 'Test User' : 'Admin User',
        email: userId === '1' ? 'test@test.com' : 'mdmasudul1979@gmail.com',
        role: userId === '1' ? 'user' : 'admin',
        isActive: true
      };
      return next();
    }

    // Handle JWT tokens
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminAuth };
