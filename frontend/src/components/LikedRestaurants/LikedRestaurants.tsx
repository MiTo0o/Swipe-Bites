import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../types';
import { userAPI, restaurantAPI } from '../../services/api';
import './LikedRestaurants.css';

interface LikedRestaurantsProps {
  isOpen: boolean;
  onClose: () => void;
  sessionLiked: string[];
}

const LikedRestaurants: React.FC<LikedRestaurantsProps> = ({
  isOpen,
  onClose,
  sessionLiked
}) => {
  const [permanentLiked, setPermanentLiked] = useState<Restaurant[]>([]);
  const [sessionRestaurants, setSessionRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<'session' | 'permanent'>('session');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPermanentLiked();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && sessionLiked.length > 0) {
      loadSessionRestaurants();
    } else {
      setSessionRestaurants([]);
    }
  }, [isOpen, sessionLiked]);

  const loadPermanentLiked = async () => {
    try {
      setLoading(true);
      setError(null);
      const restaurants = await userAPI.getLikedRestaurants();
      setPermanentLiked(restaurants);
    } catch (err) {
      console.error('Error loading permanent liked restaurants:', err);
      setError('Failed to load liked restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadSessionRestaurants = async () => {
    try {
      const restaurantPromises = sessionLiked.map(id => restaurantAPI.getRestaurant(id));
      const restaurants = await Promise.all(restaurantPromises);
      setSessionRestaurants(restaurants);
    } catch (err) {
      console.error('Error loading session restaurants:', err);
    }
  };

  const clearPermanentHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire like history? This cannot be undone.')) {
      try {
        await userAPI.clearLikedRestaurants();
        setPermanentLiked([]);
      } catch (err) {
        console.error('Error clearing history:', err);
        setError('Failed to clear history');
      }
    }
  };

  const getPriceDisplay = (price: string) => price;

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  };

  if (!isOpen) return null;

  return (
    <div className="liked-overlay">
      <div className="liked-panel">
        <div className="liked-header">
          <h3>♥ Liked Restaurants</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'session' ? 'active' : ''}`}
            onClick={() => setActiveTab('session')}
          >
            This Session ({sessionRestaurants.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'permanent' ? 'active' : ''}`}
            onClick={() => setActiveTab('permanent')}
          >
            All Time ({permanentLiked.length})
          </button>
        </div>

        {activeTab === 'permanent' && (
          <div className="tab-actions">
            <button className="clear-history-button" onClick={clearPermanentHistory}>
              Clear All History
            </button>
          </div>
        )}

        <div className="liked-content">
          {loading && activeTab === 'permanent' && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your liked restaurants...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={loadPermanentLiked} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {activeTab === 'session' && sessionRestaurants.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🍽</div>
              <h4>No likes this session</h4>
              <p>Start swiping to see your liked restaurants for this session!</p>
            </div>
          )}

          {activeTab === 'permanent' && !loading && !error && permanentLiked.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🍽</div>
              <h4>No liked restaurants yet</h4>
              <p>Start swiping to discover and save your favorite restaurants!</p>
            </div>
          )}

          {((activeTab === 'session' && sessionRestaurants.length > 0) ||
            (activeTab === 'permanent' && !loading && !error && permanentLiked.length > 0)) && (
            <div className="restaurants-grid">
              {(activeTab === 'session' ? sessionRestaurants : permanentLiked).map((restaurant) => (
                <div key={restaurant._id} className="restaurant-item">
                  <div className="restaurant-image">
                    {restaurant.imageUrl ? (
                      <img src={restaurant.imageUrl} alt={restaurant.name} />
                    ) : (
                      <div className="placeholder-image">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="restaurant-info">
                    <h4 className="restaurant-name">{restaurant.name}</h4>
                    <div className="restaurant-meta">
                      <span className="rating">
                        {getRatingStars(restaurant.rating)} {restaurant.rating}
                      </span>
                      <span className="price">{getPriceDisplay(restaurant.priceRange)}</span>
                    </div>
                    <p className="restaurant-description">
                      {restaurant.description.length > 60
                        ? `${restaurant.description.slice(0, 60)}...`
                        : restaurant.description}
                    </p>
                    <div className="restaurant-details">
                      <span className="distance">📍 {restaurant.distance.toFixed(1)} mi</span>
                      <span className="cuisine">🍽️ {restaurant.cuisineType}</span>
                    </div>
                    {restaurant.phone && (
                      <div className="restaurant-actions">
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="action-button call-button"
                        >
                          📞 Call
                        </a>
                        {restaurant.website && (
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button website-button"
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedRestaurants;