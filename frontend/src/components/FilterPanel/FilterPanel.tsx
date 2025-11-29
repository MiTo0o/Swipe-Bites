import React, { useState } from 'react';
import './FilterPanel.css';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: {
    budget?: string;
    maxDistance?: number;
    dietary?: string[];
    cuisine?: string;
  }) => void;
  currentFilters: {
    budget?: string;
    maxDistance?: number;
    dietary?: string[];
    cuisine?: string;
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters
}) => {
  const [budget, setBudget] = useState(currentFilters.budget || '');
  const [maxDistance, setMaxDistance] = useState(currentFilters.maxDistance || 5);
  const [dietary, setDietary] = useState<string[]>(currentFilters.dietary || []);
  const [cuisine, setCuisine] = useState(currentFilters.cuisine || '');

  const budgetOptions = [
    { value: '', label: 'Any Budget' },
    { value: '$', label: '$ - Under $15' },
    { value: '$$', label: '$$ - $15-25' },
    { value: '$$$', label: '$$$ - $25-40' },
    { value: '$$$$', label: '$$$$ - $40+' },
  ];

  const dietaryOptions = [
    'vegetarian',
    'gluten-free'
  ];

  const cuisineOptions = [
    { value: '', label: 'Any Cuisine' },
    { value: 'American', label: 'American' },
    { value: 'Asian', label: 'Asian' },
    { value: 'BBQ', label: 'BBQ' },
    { value: 'Cafe', label: 'Cafe' },
    { value: 'Health Food', label: 'Health Food' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Southern', label: 'Southern' },
  ];

  const handleDietaryChange = (option: string) => {
    setDietary(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const applyFilters = () => {
    onFiltersChange({
      budget: budget || undefined,
      maxDistance,
      dietary: dietary.length > 0 ? dietary : undefined,
      cuisine: cuisine || undefined,
    });
    onClose();
  };

  const clearFilters = () => {
    setBudget('');
    setMaxDistance(5);
    setDietary([]);
    setCuisine('');
    onFiltersChange({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-overlay">
      <div className="filter-panel">
        <div className="filter-header">
          <h3>Filter Restaurants</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-group">
            <label htmlFor="budget-select">Budget Range</label>
            <select
              id="budget-select"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="filter-select"
            >
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="distance-range">
              Max Distance: {maxDistance} miles
            </label>
            <input
              id="distance-range"
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="filter-range"
            />
            <div className="range-labels">
              <span>1 mi</span>
              <span>10 mi</span>
            </div>
          </div>

          <div className="filter-group">
            <label>Dietary Preferences</label>
            <div className="checkbox-group">
              {dietaryOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={dietary.includes(option)}
                    onChange={() => handleDietaryChange(option)}
                  />
                  <span className="checkbox-text">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="cuisine-select">Cuisine Type</label>
            <select
              id="cuisine-select"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="filter-select"
            >
              {cuisineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-button" onClick={clearFilters}>
            Clear All
          </button>
          <button className="apply-button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;