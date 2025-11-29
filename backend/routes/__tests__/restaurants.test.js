const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('../../models/Restaurant');
const restaurantRoutes = require('../restaurants');

const app = express();
app.use(express.json());
app.use('/restaurants', restaurantRoutes);

jest.mock('../../models/Restaurant');

describe('Restaurant Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /restaurants', () => {
    test('returns all restaurants when no filters', async () => {
      const mockRestaurants = [
        { _id: '1', name: 'Restaurant 1', rating: 4.5 },
        { _id: '2', name: 'Restaurant 2', rating: 4.0 }
      ];

      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockRestaurants)
        })
      });

      const response = await request(app)
        .get('/restaurants')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockRestaurants);
      expect(response.body.count).toBe(2);
    });

    test('filters restaurants by budget', async () => {
      const mockRestaurants = [
        { _id: '1', name: 'Cheap Restaurant', priceRange: '$' }
      ];

      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockRestaurants)
        })
      });

      const response = await request(app)
        .get('/restaurants')
        .query({ budget: '$' })
        .expect(200);

      expect(Restaurant.find).toHaveBeenCalledWith({ priceRange: '$' });
      expect(response.body.data).toEqual(mockRestaurants);
    });

    test('filters restaurants by maximum distance', async () => {
      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      });

      await request(app)
        .get('/restaurants')
        .query({ maxDistance: '3' })
        .expect(200);

      expect(Restaurant.find).toHaveBeenCalledWith({
        distance: { $lte: 3 }
      });
    });

    test('filters restaurants by dietary options', async () => {
      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      });

      await request(app)
        .get('/restaurants')
        .query({ dietary: 'vegetarian' })
        .expect(200);

      expect(Restaurant.find).toHaveBeenCalledWith({
        dietaryOptions: { $in: ['vegetarian'] }
      });
    });

    test('excludes swiped restaurant IDs', async () => {
      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      });

      await request(app)
        .get('/restaurants')
        .query({ excludeSwipedIds: '1,2,3' })
        .expect(200);

      expect(Restaurant.find).toHaveBeenCalledWith({
        _id: { $nin: ['1', '2', '3'] }
      });
    });

    test('handles database errors', async () => {
      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      const response = await request(app)
        .get('/restaurants')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('GET /restaurants/:id', () => {
    test('returns restaurant by ID', async () => {
      const mockRestaurant = { _id: '1', name: 'Test Restaurant' };
      Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);

      const response = await request(app)
        .get('/restaurants/1')
        .expect(200);

      expect(Restaurant.findById).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockRestaurant);
    });

    test('returns 404 when restaurant not found', async () => {
      Restaurant.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/restaurants/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Restaurant not found');
    });

    test('handles database errors', async () => {
      Restaurant.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/restaurants/1')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('GET /restaurants/explore/trending', () => {
    test('returns trending restaurants', async () => {
      const mockTrendingRestaurants = [
        { _id: '1', name: 'Trending Restaurant 1', rating: 4.8 },
        { _id: '2', name: 'Trending Restaurant 2', rating: 4.7 }
      ];

      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockTrendingRestaurants)
        })
      });

      const response = await request(app)
        .get('/restaurants/explore/trending')
        .expect(200);

      expect(Restaurant.find).toHaveBeenCalledWith();
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTrendingRestaurants);
    });

    test('handles errors when fetching trending restaurants', async () => {
      Restaurant.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      const response = await request(app)
        .get('/restaurants/explore/trending')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server error');
    });
  });
});