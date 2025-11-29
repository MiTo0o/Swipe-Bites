const mongoose = require('mongoose');
require('dotenv').config();
const Restaurant = require('../models/Restaurant');
const restaurantData = require('../data/restaurants');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurant data');

    const restaurants = await Restaurant.insertMany(restaurantData);
    console.log(`Inserted ${restaurants.length} restaurants`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();