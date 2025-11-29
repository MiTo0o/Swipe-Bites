import React from 'react';
import { Restaurant } from '../../types';
import './RestaurantCard.css';

interface RestaurantCardProps {
  restaurant: Restaurant;
  style?: React.CSSProperties;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  style,
  className = ''
}) => {
  const getPriceDisplay = (price: string) => {
    return price;
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="rating-stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div
      className={`restaurant-card ${className}`}
      style={style}
    >
      <div className="card-image">
        {restaurant.imageUrl ? (
          <img src={restaurant.imageUrl} alt={restaurant.name} />
        ) : (
          <div className="placeholder-image">
            <span>🍽️</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h2 className="restaurant-name">{restaurant.name}</h2>
          <div className="restaurant-meta">
            <span className="rating">
              {getRatingStars(restaurant.rating)}
              <span className="rating-number">{restaurant.rating}</span>
            </span>
            <span className="price">{getPriceDisplay(restaurant.priceRange)}</span>
          </div>
        </div>

        <p className="restaurant-description">{restaurant.description}</p>

        <div className="restaurant-details">
          <div className="detail-item">
            <span className="detail-label">📍</span>
            <span className="detail-value">{restaurant.distance.toFixed(1)} mi</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🍽️</span>
            <span className="detail-value">{restaurant.cuisineType}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🕒</span>
            <span className="detail-value">{restaurant.hours}</span>
          </div>
        </div>

        {restaurant.dietaryOptions.length > 0 && (
          <div className="dietary-options">
            {restaurant.dietaryOptions.map((option, index) => (
              <span key={index} className="dietary-tag">
                {option}
              </span>
            ))}
          </div>
        )}

        <div className="restaurant-tags">
          {restaurant.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="restaurant-address">
          <small>{restaurant.address}</small>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;