const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  priceRange: {
    type: String,
    required: true,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  distance: {
    type: Number,
    required: true
  },
  cuisineType: {
    type: String,
    required: true
  },
  dietaryOptions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher']
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  phone: String,
  website: String,
  hours: {
    type: String,
    default: '9:00 AM - 9:00 PM'
  },
  tags: [String],
  location: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

restaurantSchema.index({ cuisineType: 1, priceRange: 1, rating: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);