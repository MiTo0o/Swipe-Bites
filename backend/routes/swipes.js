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

router.post('/', requireAuth, async (req, res) => {
  try {
    const { restaurantId, action } = req.body;

    if (!restaurantId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: restaurantId, action'
      });
    }

    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Action must be either "like" or "dislike"'
      });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const swipeEntry = {
      restaurantId,
      action,
      timestamp: new Date()
    };

    user.swipeHistory.push(swipeEntry);

    if (action === 'like') {
      if (!user.likedRestaurants.includes(restaurantId)) {
        user.likedRestaurants.push(restaurantId);
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Swipe recorded successfully',
      data: swipeEntry
    });
  } catch (error) {
    console.error('Error recording swipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const totalSwipes = user.swipeHistory.length;
    const likes = user.swipeHistory.filter(swipe => swipe.action === 'like').length;
    const dislikes = totalSwipes - likes;

    res.json({
      success: true,
      data: {
        totalSwipes,
        likes,
        dislikes,
        likeRatio: totalSwipes > 0 ? (likes / totalSwipes * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching swipe stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;