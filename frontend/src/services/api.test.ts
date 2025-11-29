import axios from 'axios';
import { restaurantAPI, userAPI, swipeAPI } from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    withCredentials: true
  }
};

(mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance as any);

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('restaurantAPI', () => {
    test('getRestaurants returns restaurant data', async () => {
      const mockData = [{ _id: '1', name: 'Test Restaurant' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await restaurantAPI.getRestaurants();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/restaurants', { params: undefined });
      expect(result).toEqual(mockData);
    });

    test('getRestaurants with filters', async () => {
      const mockData = [{ _id: '1', name: 'Filtered Restaurant' }];
      const filters = { budget: '$$', maxDistance: 5 };
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await restaurantAPI.getRestaurants(filters);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/restaurants', { params: filters });
      expect(result).toEqual(mockData);
    });

    test('getRestaurant returns single restaurant', async () => {
      const mockData = { _id: '1', name: 'Test Restaurant' };
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await restaurantAPI.getRestaurant('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/restaurants/1');
      expect(result).toEqual(mockData);
    });

    test('getTrendingRestaurants returns trending data', async () => {
      const mockData = [{ _id: '1', name: 'Trending Restaurant' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await restaurantAPI.getTrendingRestaurants();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/restaurants/explore/trending');
      expect(result).toEqual(mockData);
    });
  });

  describe('userAPI', () => {
    test('getPreferences returns user preferences', async () => {
      const mockData = { budget: '$$', maxDistance: 5 };
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await userAPI.getPreferences();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/preferences');
      expect(result).toEqual(mockData);
    });

    test('updatePreferences updates user preferences', async () => {
      const mockData = { budget: '$$$', maxDistance: 10 };
      const preferences = { budget: '$$$' as const, maxDistance: 10, dietaryRestrictions: [], cuisinePreferences: [] };
      mockAxiosInstance.put.mockResolvedValue({ data: { data: mockData } });

      const result = await userAPI.updatePreferences(preferences);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/preferences', preferences);
      expect(result).toEqual(mockData);
    });

    test('getLikedRestaurants returns liked restaurants', async () => {
      const mockData = [{ _id: '1', name: 'Liked Restaurant' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await userAPI.getLikedRestaurants();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/liked');
      expect(result).toEqual(mockData);
    });

    test('getSwipeHistory returns swipe history', async () => {
      const mockData = [{ restaurantId: '1', action: 'like', timestamp: new Date() }];
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await userAPI.getSwipeHistory();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/swipe-history');
      expect(result).toEqual(mockData);
    });
  });

  describe('swipeAPI', () => {
    test('recordSwipe sends swipe data', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

      await swipeAPI.recordSwipe('restaurant1', 'like');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/swipes', {
        restaurantId: 'restaurant1',
        action: 'like'
      });
    });

    test('getSwipeStats returns statistics', async () => {
      const mockData = {
        totalSwipes: 10,
        likes: 6,
        dislikes: 4,
        likeRatio: '60.0'
      };
      mockAxiosInstance.get.mockResolvedValue({ data: { data: mockData } });

      const result = await swipeAPI.getSwipeStats();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/swipes/stats');
      expect(result).toEqual(mockData);
    });
  });

  describe('Error handling', () => {
    test('handles API errors gracefully', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(restaurantAPI.getRestaurants()).rejects.toThrow('Network error');
    });

    test('handles POST errors gracefully', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Server error'));

      await expect(swipeAPI.recordSwipe('restaurant1', 'like')).rejects.toThrow('Server error');
    });
  });
});