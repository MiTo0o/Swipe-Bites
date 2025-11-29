const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  next();
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    const user = new User({ email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.email = user.email;

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    req.session.userId = user._id;
    req.session.email = user.email;

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Could not log out'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const { budget, maxDistance, dietaryRestrictions, cuisinePreferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        $set: {
          'preferences.budget': budget,
          'preferences.maxDistance': maxDistance,
          'preferences.dietaryRestrictions': dietaryRestrictions,
          'preferences.cuisinePreferences': cuisinePreferences
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/liked', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get restaurant details for liked restaurants
    const Restaurant = require('../models/Restaurant');
    const likedRestaurants = await Restaurant.find({
      _id: { $in: user.likedRestaurants }
    });

    res.json({
      success: true,
      data: likedRestaurants
    });
  } catch (error) {
    console.error('Error fetching liked restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/swipe-history', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.swipeHistory
    });
  } catch (error) {
    console.error('Error fetching swipe history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Clear liked restaurants history
router.delete('/liked', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Clear the liked restaurants and related swipe history
    user.likedRestaurants = [];
    user.swipeHistory = user.swipeHistory.filter(swipe => swipe.action !== 'like');

    await user.save();

    res.json({
      success: true,
      message: 'Like history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing like history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;