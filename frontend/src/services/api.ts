import axios from 'axios';
import { Restaurant, UserPreferences, SwipeAction } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const restaurantAPI = {
  getRestaurants: async (filters?: {
    budget?: string;
    maxDistance?: number;
    dietary?: string[];
    cuisine?: string;
    excludeSwipedIds?: string[];
  }): Promise<Restaurant[]> => {
    const response = await api.get('/restaurants', { params: filters });
    return response.data.data;
  },

  getRestaurant: async (id: string): Promise<Restaurant> => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data.data;
  },

  getTrendingRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get('/restaurants/explore/trending');
    return response.data.data;
  },
};

export const userAPI = {
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get('/users/preferences');
    return response.data.data;
  },

  updatePreferences: async (preferences: UserPreferences): Promise<UserPreferences> => {
    const response = await api.put('/users/preferences', preferences);
    return response.data.data;
  },

  getLikedRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get('/users/liked');
    return response.data.data;
  },

  clearLikedRestaurants: async (): Promise<void> => {
    await api.delete('/users/liked');
  },

  getSwipeHistory: async (): Promise<SwipeAction[]> => {
    const response = await api.get('/users/swipe-history');
    return response.data.data;
  },
};

export const swipeAPI = {
  recordSwipe: async (restaurantId: string, action: 'like' | 'dislike'): Promise<void> => {
    await api.post('/swipes', {
      restaurantId,
      action,
    });
  },

  getSwipeStats: async (): Promise<{
    totalSwipes: number;
    likes: number;
    dislikes: number;
    likeRatio: string;
  }> => {
    const response = await api.get('/swipes/stats');
    return response.data.data;
  },
};

export default api;