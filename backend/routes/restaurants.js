const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get('/', async (req, res) => {
  try {
    const {
      budget,
      maxDistance = 5,
      dietary,
      cuisine,
      userId,
      excludeSwipedIds = []
    } = req.query;

    let query = {};

    if (budget) {
      query.priceRange = budget;
    }

    if (maxDistance) {
      query.distance = { $lte: parseFloat(maxDistance) };
    }

    if (dietary) {
      const dietaryArray = Array.isArray(dietary) ? dietary : [dietary];
      query.dietaryOptions = { $in: dietaryArray };
    }

    if (cuisine) {
      query.cuisineType = cuisine;
    }

    if (excludeSwipedIds.length > 0) {
      const excludeIds = Array.isArray(excludeSwipedIds)
        ? excludeSwipedIds
        : excludeSwipedIds.split(',');
      query._id = { $nin: excludeIds };
    }

    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

router.get('/explore/trending', async (req, res) => {
  try {
    const trendingRestaurants = await Restaurant.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: trendingRestaurants
    });
  } catch (error) {
    console.error('Error fetching trending restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;