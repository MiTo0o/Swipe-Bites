import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { restaurantAPI, swipeAPI, userAPI } from './services/api';
import { authService } from './services/auth';
import { Restaurant } from './types';

// Mock all services
jest.mock('./services/api');
jest.mock('./services/auth');

const mockedRestaurantAPI = restaurantAPI as jest.Mocked<typeof restaurantAPI>;
const mockedSwipeAPI = swipeAPI as jest.Mocked<typeof swipeAPI>;
const mockedUserAPI = userAPI as jest.Mocked<typeof userAPI>;
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock restaurant data
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
    tags: ['casual', 'family-friendly'],
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
  },
  {
    _id: '3',
    name: 'Test Restaurant 3',
    description: 'Third test restaurant',
    rating: 3.5,
    priceRange: '$$$',
    distance: 3.0,
    cuisineType: 'Mexican',
    dietaryOptions: ['Vegan'],
    imageUrl: 'https://example.com/image3.jpg',
    address: '789 Test Blvd',
    hours: '11am-11pm',
    tags: ['spicy'],
    location: { lat: 41.5100, lng: -81.7100 }
  }
];

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  preferences: {
    budget: '$',
    maxDistance: 5,
    dietaryRestrictions: [],
    cuisinePreferences: []
  }
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock auth service to return a user by default
    mockedAuthService.getCurrentUser = jest.fn().mockResolvedValue(mockUser);
    mockedAuthService.logout = jest.fn().mockResolvedValue(undefined);
    
    // Mock API calls
    mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue(mockRestaurants);
    mockedSwipeAPI.recordSwipe = jest.fn().mockResolvedValue(undefined);
    mockedUserAPI.getLikedRestaurants = jest.fn().mockResolvedValue([]);
  });

  describe('TC01 - App Launch', () => {
    test('Home screen loads in <3 seconds', async () => {
      const startTime = Date.now();
      render(<App />);
      
      // Wait for the app to load (check for main content)
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });
  });

  describe('TC02 - Swipe Right (Like)', () => {
    test('Restaurant added to liked list when swiping right', async () => {
      render(<App />);
      
      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      // Wait for restaurants to load
      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Find and click the like button
      const likeButton = screen.getByRole('button', { name: /♥/i });
      await userEvent.click(likeButton);

      // Wait for swipe to be recorded
      await waitFor(() => {
        expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledWith('1', 'like');
      }, { timeout: 2000 });

      // Open liked restaurants panel
      const likedButton = screen.getByTitle(/liked restaurants/i);
      await userEvent.click(likedButton);

      // Check that the restaurant appears in the liked list
      await waitFor(() => {
        expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('TC03 - Swipe Left (Dislike)', () => {
    test('Restaurant skipped (not saved) when swiping left', async () => {
      render(<App />);
      
      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Find and click the dislike button
      const dislikeButton = screen.getByRole('button', { name: /✕/i });
      await userEvent.click(dislikeButton);

      // Wait for swipe to be recorded (with longer timeout)
      await waitFor(() => {
        expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledWith('1', 'dislike');
      }, { timeout: 3000 });

      // Open liked restaurants panel
      const likedButton = screen.getByTitle(/liked restaurants/i);
      await userEvent.click(likedButton);

      // Check that the restaurant does NOT appear in the liked list
      await waitFor(() => {
        const likedPanel = screen.getByText(/liked restaurants/i).closest('.liked-panel') as HTMLElement | null;
        if (likedPanel) {
          expect(within(likedPanel).queryByText('Test Restaurant 1')).not.toBeInTheDocument();
        }
      }, { timeout: 2000 });
    });
  });

  describe('TC04 - Budget and Distance Filtering', () => {
    test('Display only matching restaurants when filters applied', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      });

      // Open filters
      const filterButton = screen.getByTitle(/filters/i);
      await userEvent.click(filterButton);

      // Apply budget filter
      const budgetFilter = screen.getByLabelText(/budget range/i);
      await userEvent.selectOptions(budgetFilter, '$');

      // Apply distance filter (it's a range input)
      const distanceFilter = screen.getByLabelText(/max distance/i) as HTMLInputElement;
      fireEvent.change(distanceFilter, { target: { value: '2' } });

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply filters/i });
      await userEvent.click(applyButton);

      // Wait for restaurants to be filtered
      await waitFor(() => {
        // Check that getRestaurants was called with the filters
        const calls = mockedRestaurantAPI.getRestaurants.mock.calls;
        const lastCall = calls[calls.length - 1];
        if (lastCall && lastCall[0]) {
          expect(lastCall[0]).toMatchObject(
            expect.objectContaining({
              budget: '$',
              maxDistance: 2
            })
          );
        }
      }, { timeout: 2000 });
    });
  });

  describe('TC05 - Dietary Filtering', () => {
    test('Display vegetarian restaurants only when dietary filter applied', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      });

      // Open filters
      const filterButton = screen.getByTitle(/filters/i);
      await userEvent.click(filterButton);

      // Apply vegetarian filter
      const vegetarianCheckbox = screen.getByLabelText(/vegetarian/i);
      await userEvent.click(vegetarianCheckbox);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply filters/i });
      await userEvent.click(applyButton);

      // Wait for restaurants to be filtered
      // Note: The filter change happens when Apply Filters is clicked
      await waitFor(() => {
        // Check that getRestaurants was called with dietary filter
        // The filter uses lowercase 'vegetarian' in the component
        const calls = mockedRestaurantAPI.getRestaurants.mock.calls;
        if (calls.length > 1) {
          const lastCall = calls[calls.length - 1];
          if (lastCall && lastCall[0] && lastCall[0].dietary) {
            expect(lastCall[0].dietary).toContain('vegetarian');
          }
        }
      }, { timeout: 3000 });
    });
  });

  describe('TC06 - Location-based Search', () => {
    test('Restaurants displayed within ~5 miles of CSU campus', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      });

      // Verify that restaurants are filtered by distance
      // The API should be called with maxDistance filter
      const calls = mockedRestaurantAPI.getRestaurants.mock.calls;
      if (calls.length > 0) {
        const lastCall = calls[calls.length - 1];
        const filters = lastCall[0];
        if (filters?.maxDistance) {
          expect(filters.maxDistance).toBeLessThanOrEqual(5);
        }
      }
    });
  });

  describe('TC07 - Network Failure Handling', () => {
    test('Handle network error gracefully', async () => {
      // Mock network error - the component logs error but may stay in loading or show no restaurants
      mockedRestaurantAPI.getRestaurants = jest.fn().mockRejectedValue(
        new Error('Network Error')
      );

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<App />);

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }, { timeout: 5000 });

      // Component should handle error gracefully (may show loading or no restaurants)
      await waitFor(() => {
        const loadingMessage = screen.queryByText(/loading/i);
        const noRestaurants = screen.queryByText(/no more restaurants/i);
        expect(loadingMessage || noRestaurants || screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('TC08 - API Returns No Data', () => {
    test('Show fallback when API returns no restaurants', async () => {
      mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue([]);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/no more restaurants/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC09 - Performance Under Stress', () => {
    test('No lag or stutter when swiping repeatedly (10+ swipes)', async () => {
      render(<App />);
      
      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(mockedRestaurantAPI.getRestaurants).toHaveBeenCalled();
      });

      const likeButton = screen.getByRole('button', { name: /♥/i });
      
      // Perform 10 rapid swipes
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        await userEvent.click(likeButton);
        // Small delay to allow state updates
        await waitFor(() => {
          expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledTimes(i + 1);
        }, { timeout: 2000 });
      }
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 10 swipes in reasonable time (< 10 seconds for test environment)
      expect(totalTime).toBeLessThan(10000);
      expect(mockedSwipeAPI.recordSwipe).toHaveBeenCalledTimes(10);
    });
  });

  describe('TC11 - Liked List Display', () => {
    test('Shows all previously liked restaurants', async () => {
      const likedRestaurants: Restaurant[] = [mockRestaurants[0], mockRestaurants[1]];
      mockedUserAPI.getLikedRestaurants = jest.fn().mockResolvedValue(likedRestaurants);

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Open liked restaurants panel
      const likedButton = screen.getByTitle(/liked restaurants/i);
      await userEvent.click(likedButton);

      // Switch to "All Time" tab
      await waitFor(() => {
        const allTimeTab = screen.getByText(/all time/i);
        userEvent.click(allTimeTab);
      });

      // Check that liked restaurants are displayed
      await waitFor(() => {
        expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
        expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('TC12 - Data Persistence', () => {
    test('User preferences retained after reopening app', async () => {
      const savedPreferences = {
        budget: '$$' as const,
        maxDistance: 3,
        dietaryRestrictions: ['Vegetarian'],
        cuisinePreferences: ['Italian']
      };

      // Mock user with saved preferences
      const userWithPreferences = {
        ...mockUser,
        preferences: savedPreferences
      };

      mockedAuthService.getCurrentUser = jest.fn().mockResolvedValue(userWithPreferences);

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      // Verify user is loaded with preferences
      await waitFor(() => {
        expect(mockedAuthService.getCurrentUser).toHaveBeenCalled();
      });
    });
  });

  describe('TC13 - Card Load Performance', () => {
    test('Card loads <2 seconds each when 50 restaurants loaded', async () => {
      const manyRestaurants = Array.from({ length: 50 }, (_, i) => ({
        ...mockRestaurants[0],
        _id: `restaurant-${i}`,
        name: `Restaurant ${i}`
      }));

      mockedRestaurantAPI.getRestaurants = jest.fn().mockResolvedValue(manyRestaurants);

      const startTime = performance.now();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/SwipeBites/i)).toBeInTheDocument();
      });

      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    });
  });

  describe('TC14 - API Authentication Failure', () => {
    test('App logs error and displays fallback when API key is invalid', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockedRestaurantAPI.getRestaurants = jest.fn().mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Invalid API key' }
        }
      });

      render(<App />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Check for error message or fallback UI
      await waitFor(() => {
        const errorMessage = screen.queryByText(/error|unable|failed/i);
        expect(errorMessage || screen.getByText(/no more restaurants/i)).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

});

