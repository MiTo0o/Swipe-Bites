import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
  restaurantAPI: {
    getRestaurants: jest.fn().mockResolvedValue([]),
  },
  swipeAPI: {
    recordSwipe: jest.fn().mockResolvedValue({}),
  }
}));

describe('App', () => {
  test('renders app header with title', () => {
    render(<App />);
    expect(screen.getByText('🍽️ SwipeBites')).toBeInTheDocument();
    expect(screen.getByText('Discover restaurants near Cleveland State University')).toBeInTheDocument();
  });

  test('renders filter and liked buttons', () => {
    render(<App />);
    expect(screen.getByText('🔍 Filters')).toBeInTheDocument();
    expect(screen.getByText('💖 Liked')).toBeInTheDocument();
  });

  test('opens filter panel when filter button clicked', () => {
    render(<App />);

    const filterButton = screen.getByText('🔍 Filters');
    fireEvent.click(filterButton);

    expect(screen.getByText('Filter Restaurants')).toBeInTheDocument();
  });

  test('opens liked restaurants panel when liked button clicked', () => {
    render(<App />);

    const likedButton = screen.getByText('💖 Liked');
    fireEvent.click(likedButton);

    expect(screen.getByText('💖 Liked Restaurants')).toBeInTheDocument();
  });

  test('shows filter count when filters are active', () => {
    render(<App />);

    fireEvent.click(screen.getByText('🔍 Filters'));

    const budgetSelect = screen.getByLabelText(/budget range/i);
    fireEvent.change(budgetSelect, { target: { value: '$$' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('closes filter panel when close button clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('🔍 Filters'));
    expect(screen.getByText('Filter Restaurants')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /✕/ });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Filter Restaurants')).not.toBeInTheDocument();
  });

  test('closes liked panel when close button clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('💖 Liked'));
    expect(screen.getByText('💖 Liked Restaurants')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /✕/ });
    fireEvent.click(closeButton);

    expect(screen.queryByText('💖 Liked Restaurants')).not.toBeInTheDocument();
  });
});
