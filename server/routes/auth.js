const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'heritagewalk_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'An account with this email already exists' } });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        wishlist: user.wishlist,
        contributionCount: user.contributionCount,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join('. ');
      return res.status(400).json({ error: { message } });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Please provide email and password' } });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        wishlist: user.wishlist,
        contributionCount: user.contributionCount,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug type location photos');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      wishlist: user.wishlist,
      contributionCount: user.contributionCount,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile - Update profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const { name, bio, location, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        wishlist: user.wishlist,
        contributionCount: user.contributionCount,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/wishlist/:siteId - Toggle wishlist
router.post('/wishlist/:siteId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const siteId = req.params.siteId;
    const index = user.wishlist.indexOf(siteId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from wishlist', wishlisted: false, wishlist: user.wishlist });
    } else {
      user.wishlist.push(siteId);
      await user.save();
      res.json({ message: 'Added to wishlist', wishlisted: true, wishlist: user.wishlist });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
