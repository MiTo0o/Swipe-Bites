const request = require('supertest');
const express = require('express');
const User = require('../../models/User');
const swipeRoutes = require('../swipes');

const app = express();
app.use(express.json());
app.use('/swipes', swipeRoutes);

jest.mock('../../models/User');

describe('Swipe Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /swipes', () => {
    test('records a new swipe for existing user', async () => {
      const mockUser = {
        _id: 'user1',
        swipeHistory: [],
        likedRestaurants: [],
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const swipeData = {
        userId: 'user1',
        restaurantId: 'restaurant1',
        action: 'like'
      };

      const response = await request(app)
        .post('/swipes')
        .send(swipeData)
        .expect(200);

      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(mockUser.swipeHistory).toHaveLength(1);
      expect(mockUser.swipeHistory[0].restaurantId).toBe('restaurant1');
      expect(mockUser.swipeHistory[0].action).toBe('like');
      expect(mockUser.likedRestaurants).toContain('restaurant1');
      expect(mockUser.save).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
    });

    test('creates new user if not exists and records swipe', async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      const mockNewUser = {
        _id: 'newuser',
        email: 'usernewuser@csu.edu',
        preferences: {},
        swipeHistory: [],
        likedRestaurants: [],
        save: jest.fn().mockResolvedValue(true)
      };

      User.mockImplementation(() => mockNewUser);

      const swipeData = {
        userId: 'newuser',
        restaurantId: 'restaurant1',
        action: 'like'
      };

      const response = await request(app)
        .post('/swipes')
        .send(swipeData)
        .expect(200);

      expect(mockNewUser.swipeHistory).toHaveLength(1);
      expect(mockNewUser.likedRestaurants).toContain('restaurant1');
      expect(mockNewUser.save).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
    });

    test('records dislike without adding to liked restaurants', async () => {
      const mockUser = {
        _id: 'user1',
        swipeHistory: [],
        likedRestaurants: [],
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const swipeData = {
        userId: 'user1',
        restaurantId: 'restaurant1',
        action: 'dislike'
      };

      const response = await request(app)
        .post('/swipes')
        .send(swipeData)
        .expect(200);

      expect(mockUser.swipeHistory).toHaveLength(1);
      expect(mockUser.swipeHistory[0].action).toBe('dislike');
      expect(mockUser.likedRestaurants).not.toContain('restaurant1');
      expect(response.body.success).toBe(true);
    });

    test('validates required fields', async () => {
      const response = await request(app)
        .post('/swipes')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    test('validates action field', async () => {
      const response = await request(app)
        .post('/swipes')
        .send({
          userId: 'user1',
          restaurantId: 'restaurant1',
          action: 'invalid'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Action must be either "like" or "dislike"');
    });

    test('handles database errors', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/swipes')
        .send({
          userId: 'user1',
          restaurantId: 'restaurant1',
          action: 'like'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server error');
    });
  });

  describe('GET /swipes/stats/:userId', () => {
    test('returns swipe statistics for user', async () => {
      const mockUser = {
        swipeHistory: [
          { action: 'like' },
          { action: 'like' },
          { action: 'dislike' },
          { action: 'like' }
        ]
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/swipes/stats/user1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalSwipes).toBe(4);
      expect(response.body.data.likes).toBe(3);
      expect(response.body.data.dislikes).toBe(1);
      expect(response.body.data.likeRatio).toBe('75.0');
    });

    test('returns zero stats for user with no swipes', async () => {
      const mockUser = {
        swipeHistory: []
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/swipes/stats/user1')
        .expect(200);

      expect(response.body.data.totalSwipes).toBe(0);
      expect(response.body.data.likes).toBe(0);
      expect(response.body.data.dislikes).toBe(0);
      expect(response.body.data.likeRatio).toBe(0);
    });

    test('returns 404 when user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/swipes/stats/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });

    test('handles database errors', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/swipes/stats/user1')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server error');
    });
  });
});