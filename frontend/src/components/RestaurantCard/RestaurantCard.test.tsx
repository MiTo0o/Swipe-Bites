import React from 'react';
import { render, screen } from '@testing-library/react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../../types';

const mockRestaurant: Restaurant = {
  _id: '1',
  name: 'Test Restaurant',
  description: 'A test restaurant with great food',
  rating: 4.5,
  priceRange: '$$',
  distance: 1.2,
  cuisineType: 'American',
  dietaryOptions: ['vegetarian', 'gluten-free'],
  imageUrl: '/test-image.jpg',
  address: '123 Test St, Cleveland, OH',
  phone: '(216) 555-0123',
  website: 'https://testrestaurant.com',
  hours: '9:00 AM - 10:00 PM',
  tags: ['casual', 'family-friendly'],
  location: { lat: 41.5, lng: -81.7 }
};

describe('RestaurantCard', () => {
  test('renders restaurant information correctly', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('A test restaurant with great food')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('$$')).toBeInTheDocument();
    expect(screen.getByText('1.2 mi')).toBeInTheDocument();
    expect(screen.getByText('American')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 10:00 PM')).toBeInTheDocument();
  });

  test('renders dietary options', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText('vegetarian')).toBeInTheDocument();
    expect(screen.getByText('gluten-free')).toBeInTheDocument();
  });

  test('renders tags', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText('casual')).toBeInTheDocument();
    expect(screen.getByText('family-friendly')).toBeInTheDocument();
  });

  test('renders address', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText('123 Test St, Cleveland, OH')).toBeInTheDocument();
  });

  test('renders placeholder when no image provided', () => {
    const restaurantWithoutImage = { ...mockRestaurant, imageUrl: '' };
    const { container } = render(<RestaurantCard restaurant={restaurantWithoutImage} />);

    const placeholder = container.querySelector('.placeholder-image');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder?.textContent).toContain('🍽️');
  });

  test('applies custom className and style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <RestaurantCard
        restaurant={mockRestaurant}
        className="custom-class"
        style={customStyle}
      />
    );

    const card = container.querySelector('.restaurant-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveStyle('background-color: red');
  });
});