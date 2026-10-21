const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'heritagewalk_2026';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: { message: 'Please log in to continue' } });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: { message: 'Access denied: Administrator privileges required' } });
    }
  });
};

module.exports = auth;
module.exports.auth = auth;
module.exports.adminAuth = adminAuth;

