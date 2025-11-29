import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onFiltersChange: jest.fn(),
  currentFilters: {
    budget: '$$',
    maxDistance: 3,
    dietary: ['vegetarian'],
    cuisine: 'American'
  }
};

describe('FilterPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when open', () => {
    render(<FilterPanel {...mockProps} />);
    expect(screen.getByText('Filter Restaurants')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<FilterPanel {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Filter Restaurants')).not.toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    render(<FilterPanel {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: /✕/ }));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('displays current filter values', () => {
    render(<FilterPanel {...mockProps} />);

    const budgetSelect = screen.getByDisplayValue('$$ - $15-25');
    expect(budgetSelect).toBeInTheDocument();

    const distanceRange = screen.getByDisplayValue('3');
    expect(distanceRange).toBeInTheDocument();

    const vegetarianCheckbox = screen.getByRole('checkbox', { name: /vegetarian/i });
    expect(vegetarianCheckbox).toBeChecked();

    const cuisineSelect = screen.getByDisplayValue('American');
    expect(cuisineSelect).toBeInTheDocument();
  });

  test('updates budget filter', () => {
    render(<FilterPanel {...mockProps} />);

    const budgetSelect = screen.getByLabelText(/budget range/i);
    fireEvent.change(budgetSelect, { target: { value: '$$$' } });

    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ budget: '$$$' })
    );
  });

  test('updates distance filter', () => {
    render(<FilterPanel {...mockProps} />);

    const distanceRange = screen.getByLabelText(/max distance/i);
    fireEvent.change(distanceRange, { target: { value: '7' } });

    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ maxDistance: 7 })
    );
  });

  test('toggles dietary options', () => {
    render(<FilterPanel {...mockProps} />);

    const glutenFreeCheckbox = screen.getByRole('checkbox', { name: /gluten-free/i });
    fireEvent.click(glutenFreeCheckbox);

    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dietary: expect.arrayContaining(['vegetarian', 'gluten-free'])
      })
    );
  });

  test('clears all filters', () => {
    render(<FilterPanel {...mockProps} />);

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearButton);

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith({});
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('applies filters and closes panel', () => {
    render(<FilterPanel {...mockProps} />);

    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockProps.onFiltersChange).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});