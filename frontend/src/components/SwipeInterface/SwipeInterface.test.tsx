import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwipeInterface from './SwipeInterface';
import { restaurantAPI, swipeAPI } from '../../services/api';
import { Restaurant } from '../../types';

// Mock the API
jest.mock('../../services/api');
jest.mock('react-spring', () => ({
  useSpring: () => [{
    x: { to: () => 'translate3d(0px, 0px, 0)', get: () => 0 },
    y: { to: () => '', get: () => 0 },
    rotation: { to: () => '', get: () => 0 },
    scale: { to: () => '', get: () => 1 }
  }, jest.fn()],
  animated: {
    div: 'div'
  }
}));

const mockedRestaurantAPI = restaurantAPI as jest.Mocked<typeof restaurantAPI>;
const mockedSwipeAPI = swipeAPI as jest.Mocked<typeof swipeAPI>;

const mockRestaurants: Restaurant[] = [
  {
    _id: '1',
    name: 'Test Restaurant 1',
    description: 'A test restaurant',
    rating: 4.5,
    priceRange: '$',
    distance: 1.5,
    cuisineType: 'American',
    dietaryOptions: ['Vegetarian'],
    imageUrl: 'https://example.com/image1.jpg',
    address: '123 Test St',
    hours: '9am-9pm',
    tags: ['casual'],
    location: { lat: 41.4993, lng: -81.6944 }
  },
  {
    _id: '2',
    name: 'Test Restaurant 2',
    description: 'Another test restaurant',
    rating: 4.0,
    priceRange: '$$',
    distance: 2.5,
    cuisineType: 'Italian',
    dietaryOptions: [],
    imageUrl: 'https://example.com/image2.jpg',
    address: '456 Test Ave',
    hours: '10am-10pm',
    tags: ['fine-dining'],
    location: { lat: 41.5000, lng: -81.7000 }
  }
];

describe('SwipeInterface Component Tests', () => {
  const mockOnSwipe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue(mockRestaurants);
    mockedSwipeAPI.recordSwipe = jest.fn().mockResolvedValue(undefined);
  });

  test('TC02 - Swipe right adds restaurant to liked list', async () => {
    render(<SwipeInterface onSwipe={mockOnSwipe} />);

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    });

    const likeButton = screen.getByRole('button', { name: /♥/i });
    await userEvent.click(likeButton);

    await waitFor(() => {
      expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledWith('1', 'like');
      expect(mockOnSwipe).toHaveBeenCalledWith(
        expect.objectContaining({ _id: '1' }),
        'like'
      );
    });
  });

  test('TC03 - Swipe left skips restaurant (not saved)', async () => {
    render(<SwipeInterface onSwipe={mockOnSwipe} />);

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    });

    const dislikeButton = screen.getByRole('button', { name: /✕/i });
    await userEvent.click(dislikeButton);

    await waitFor(() => {
      expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledWith('1', 'dislike');
      expect(mockOnSwipe).toHaveBeenCalledWith(
        expect.objectContaining({ _id: '1' }),
        'dislike'
      );
    });
  });

  test('TC04 - Filters are applied correctly', async () => {
    const filters = {
      budget: '$',
      maxDistance: 2
    };

    render(<SwipeInterface filters={filters} />);

    await waitFor(() => {
      expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({
          budget: '$',
          maxDistance: 2
        })
      );
    });
  });

  test('TC05 - Dietary filter applied correctly', async () => {
    const filters = {
      dietary: ['Vegetarian']
    };

    render(<SwipeInterface filters={filters} />);

    await waitFor(() => {
      expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({
          dietary: ['Vegetarian']
        })
      );
    });
  });

  test('TC07 - Shows error message on network failure', async () => {
    mockedRestaurantAPI.getRestaurants = jest.fn().mockRejectedValue(
      new Error('Network Error')
    );

    render(<SwipeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/unable to load restaurants|error|failed/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('TC08 - Shows no restaurants message when API returns empty', async () => {
    mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue([]);

    render(<SwipeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/no more restaurants/i)).toBeInTheDocument();
    });
  });

  test('TC09 - Handles rapid swipes without lag', async () => {
    const manyRestaurants = Array.from({ length: 20 }, (_, i) => ({
      ...mockRestaurants[0],
      _id: `restaurant-${i}`,
      name: `Restaurant ${i}`
    }));

    mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue(manyRestaurants);

    render(<SwipeInterface onSwipe={mockOnSwipe} />);

    await waitFor(() => {
      expect(screen.getByText(/Restaurant 0/i)).toBeInTheDocument();
    });

    const likeButton = screen.getByRole('button', { name: /♥/i });
    
    const startTime = performance.now();
    for (let i = 0; i < 10; i++) {
      await userEvent.click(likeButton);
      await waitFor(() => {
        expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledTimes(i + 1);
      }, { timeout: 1000 });
    }
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(5000);
    expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledTimes(10);
  });

  test('Shows loading state initially', () => {
    mockedRestaurantAPI.getRestaurants = jest.fn(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<SwipeInterface />);

    expect(screen.getByText(/loading restaurants/i)).toBeInTheDocument();
  });

  test('Displays feedback text on swipe', async () => {
    render(<SwipeInterface />);

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    });

    const likeButton = screen.getByRole('button', { name: /♥/i });
    await userEvent.click(likeButton);

    // Check for feedback text (like "Like!", "Yum!", etc.)
    await waitFor(() => {
      const feedback = screen.queryByText(/like|yum|tasty|delicious|yes|nice/i);
      expect(feedback).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

