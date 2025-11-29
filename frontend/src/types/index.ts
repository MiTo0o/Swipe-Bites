export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  distance: number;
  cuisineType: string;
  dietaryOptions: string[];
  imageUrl: string;
  address: string;
  phone?: string;
  website?: string;
  hours: string;
  tags: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  budget: '$' | '$$' | '$$$' | '$$$$';
  maxDistance: number;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
}

export interface SwipeAction {
  restaurantId: string;
  action: 'like' | 'dislike';
  timestamp: Date;
}

export interface User {
  _id: string;
  email: string;
  preferences: UserPreferences;
  swipeHistory: SwipeAction[];
  likedRestaurants: string[];
}