import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios for credentials
axios.defaults.withCredentials = true;

export interface User {
  id: string;
  email: string;
  preferences?: {
    budget: string;
    maxDistance: number;
    dietaryRestrictions: string[];
    cuisinePreferences: string[];
  };
}

export const authService = {
  async register(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        email,
        password
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/users/logout`);
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/users/me`);

      if (response.data.success) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
};