import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import { Restaurant } from '../../types';
import { restaurantAPI, swipeAPI } from '../../services/api';
import './SwipeInterface.css';

interface SwipeInterfaceProps {
  filters?: {
    budget?: string;
    maxDistance?: number;
    dietary?: string[];
    cuisine?: string;
  };
  onSwipe?: (restaurant: Restaurant, action: 'like' | 'dislike') => void;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
  filters,
  onSwipe
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipedRestaurants, setSwipedRestaurants] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null);
  const [allowShadowTransition, setAllowShadowTransition] = useState(false);

  const [{ x, y, rotation, scale }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  }));

  // Springs for background cards to animate smoothly
  const [backgroundCard1, setBackgroundCard1] = useSpring(() => ({
    scale: 0.95,
    y: -10,
    immediate: false,
  }));

  const [backgroundCard2, setBackgroundCard2] = useSpring(() => ({
    scale: 0.9,
    y: -20,
    immediate: false,
  }));

  // Shuffle array function
  const shuffleArray = (array: Restaurant[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);

      const data = await restaurantAPI.getRestaurants({
        ...filters,
      });

      // Shuffle the restaurants randomly each time we load
      const shuffledRestaurants = shuffleArray(data);
      setRestaurants(shuffledRestaurants);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Reset animation when currentIndex changes (new card becomes active)
  useLayoutEffect(() => {
    if (currentIndex > 0) { // Don't reset on initial load
      // Disable shadow transition during the reset
      setAllowShadowTransition(false);
      
      set({ x: 0, y: 0, rotation: 0, scale: 1, immediate: true });

      // Animate background cards to their new positions
      setBackgroundCard1({ scale: 0.95, y: -10 });
      setBackgroundCard2({ scale: 0.9, y: -20 });
      
      // Enable shadow transition after transform animations have fully completed
      // The background card animation takes ~300ms, so wait a bit longer
      setTimeout(() => {
        setAllowShadowTransition(true);
      }, 500);
    }
  }, [currentIndex, set, setBackgroundCard1, setBackgroundCard2]);

  const currentRestaurant = restaurants[currentIndex];

  const handleSwipe = useCallback(async (restaurant: Restaurant, action: 'like' | 'dislike') => {
    if (isAnimating) return;

    try {
      setIsAnimating(true);
      await swipeAPI.recordSwipe(restaurant._id, action);
      setSwipedRestaurants(prev => [...prev, restaurant._id]);
      onSwipe?.(restaurant, action);

      setIsAnimating(false);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording swipe:', error);
      setIsAnimating(false);
    }
  }, [onSwipe, isAnimating]);

  const handleButtonSwipe = useCallback((action: 'like' | 'dislike') => {
    if (!currentRestaurant || isAnimating) return;

    // Prevent double clicks immediately
    setIsAnimating(true);

    // Random feedback text
    const likeTexts = ['Like!', 'Yum!', 'Tasty!', 'Delicious!', 'Yes!', 'Nice!'];
    const dislikeTexts = ['Nope!', 'Pass!', 'Next!', 'Skip!', 'Meh!', 'Not for me!'];

    const texts = action === 'like' ? likeTexts : dislikeTexts;
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    // Show feedback
    setFeedbackText(randomText);
    setFeedbackType(action);

    const direction = action === 'like' ? 1 : -1;
    const exitX = direction * window.innerWidth;
    const exitRotation = direction * 30;

    // Animate current card out
    set({
      x: exitX,
      rotation: exitRotation,
      scale: 1,
    });

    // After animation completes, update the state and let the next card become active
    setTimeout(() => {
      handleSwipe(currentRestaurant, action);
    }, 300);

    // Clear feedback after CSS animation completes
    setTimeout(() => {
      setFeedbackText(null);
      setFeedbackType(null);
    }, 800);
  }, [currentRestaurant, handleSwipe, set, setBackgroundCard1, setBackgroundCard2, isAnimating]);

  if (loading) {
    return (
      <div className="swipe-interface">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  // Only show "no more cards" if we're not loading and truly have no more restaurants
  if ((!currentRestaurant || currentIndex >= restaurants.length) && !loading) {
    return (
      <div className="swipe-interface">
        <div className="no-more-cards">
          <h3>No more restaurants!</h3>
          <p>Try adjusting your filters or check back later for more options.</p>
          <button onClick={loadRestaurants} className="reload-button">
            🔄 Reload
          </button>
        </div>
      </div>
    );
  }

  // Show loading state if we don't have a current restaurant but we're loading
  if (!currentRestaurant && loading) {
    return (
      <div className="swipe-interface">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading more restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-interface">
      {/* Food Icons Grid - Rotated 45 degrees */}
      <div className="food-icons-grid">
        <i className="fas fa-pizza-slice food-icon"></i>
        <i className="fas fa-hamburger food-icon"></i>
        <i className="fas fa-coffee food-icon"></i>
        <i className="fas fa-utensils food-icon"></i>
        <i className="fas fa-wine-glass food-icon"></i>
        <i className="fas fa-ice-cream food-icon"></i>
        <i className="fas fa-bread-slice food-icon"></i>
        <i className="fas fa-fish food-icon"></i>

        <i className="fas fa-cheese food-icon"></i>
        <i className="fas fa-apple-alt food-icon"></i>
        <i className="fas fa-carrot food-icon"></i>
        <i className="fas fa-lemon food-icon"></i>
        <i className="fas fa-pepper-hot food-icon"></i>
        <i className="fas fa-drumstick-bite food-icon"></i>
        <i className="fas fa-birthday-cake food-icon"></i>
        <i className="fas fa-hotdog food-icon"></i>

        <i className="fas fa-mug-hot food-icon"></i>
        <i className="fas fa-cocktail food-icon"></i>
        <i className="fas fa-cookie-bite food-icon"></i>
        <i className="fas fa-pizza-slice food-icon"></i>
        <i className="fas fa-pizza-slice food-icon"></i>
        <i className="fas fa-coffee food-icon"></i>
        <i className="fas fa-hamburger food-icon"></i>
        <i className="fas fa-ice-cream food-icon"></i>

        <i className="fas fa-fish food-icon"></i>
        <i className="fas fa-bread-slice food-icon"></i>
        <i className="fas fa-wine-glass food-icon"></i>
        <i className="fas fa-cheese food-icon"></i>
        <i className="fas fa-utensils food-icon"></i>
        <i className="fas fa-apple-alt food-icon"></i>
        <i className="fas fa-drumstick-bite food-icon"></i>
        <i className="fas fa-mug-hot food-icon"></i>

        <i className="fas fa-lemon food-icon"></i>
        <i className="fas fa-carrot food-icon"></i>
        <i className="fas fa-hotdog food-icon"></i>
        <i className="fas fa-pepper-hot food-icon"></i>
        <i className="fas fa-cocktail food-icon"></i>
        <i className="fas fa-cookie-bite food-icon"></i>
        <i className="fas fa-fish food-icon"></i>
        <i className="fas fa-pizza-slice food-icon"></i>

        <i className="fas fa-coffee food-icon"></i>
        <i className="fas fa-hamburger food-icon"></i>
        <i className="fas fa-utensils food-icon"></i>
        <i className="fas fa-wine-glass food-icon"></i>
        <i className="fas fa-ice-cream food-icon"></i>
        <i className="fas fa-bread-slice food-icon"></i>
        <i className="fas fa-fish food-icon"></i>
        <i className="fas fa-cheese food-icon"></i>

        <i className="fas fa-apple-alt food-icon"></i>
        <i className="fas fa-carrot food-icon"></i>
        <i className="fas fa-lemon food-icon"></i>
        <i className="fas fa-pepper-hot food-icon"></i>
        <i className="fas fa-drumstick-bite food-icon"></i>
        <i className="fas fa-lemon food-icon"></i>
        <i className="fas fa-hotdog food-icon"></i>
        <i className="fas fa-mug-hot food-icon"></i>

        <i className="fas fa-cocktail food-icon"></i>
        <i className="fas fa-cookie-bite food-icon"></i>
        <i className="fas fa-cheese food-icon"></i>
        <i className="fas fa-pizza-slice food-icon"></i>
        <i className="fas fa-coffee food-icon"></i>
        <i className="fas fa-hamburger food-icon"></i>
        <i className="fas fa-utensils food-icon"></i>
        <i className="fas fa-wine-glass food-icon"></i>

        <i className="fas fa-bread-slice food-icon"></i>
        <i className="fas fa-fish food-icon"></i>
        <i className="fas fa-apple-alt food-icon"></i>
        <i className="fas fa-ice-cream food-icon"></i>
      </div>
      <div className="card-stack">
        {restaurants.slice(currentIndex, currentIndex + 3).map((restaurant, index) => {
          const AnimatedDiv = animated.div as any;

          let animatedStyle;
          if (index === 0) {
            // Top card uses main spring animations
            animatedStyle = {
              transform: x.to(xVal => `translate3d(${xVal}px, ${y.get()}px, 0) rotate(${rotation.get()}deg) scale(${scale.get()})`),
              opacity: 1,
              zIndex: 3,
            };
          } else if (index === 1) {
            // Second card uses backgroundCard1 spring
            animatedStyle = {
              transform: backgroundCard1.scale.to(s => `scale(${s}) translateY(${backgroundCard1.y.get()}px)`),
              opacity: 1,
              zIndex: 2,
            };
          } else if (index === 2) {
            // Third card uses backgroundCard2 spring
            animatedStyle = {
              transform: backgroundCard2.scale.to(s => `scale(${s}) translateY(${backgroundCard2.y.get()}px)`),
              opacity: 1,
              zIndex: 1,
            };
          }

          return (
            <AnimatedDiv
              key={restaurant._id}
              className={`card-container ${index === 0 ? 'top-card' : ''} ${index === 0 && isAnimating ? 'animating' : ''} ${allowShadowTransition ? 'shadow-ready' : ''}`}
              style={animatedStyle}
            >
              <RestaurantCard restaurant={restaurant} />
            </AnimatedDiv>
          );
        })}
      </div>

      {feedbackText && (
        <div className={`swipe-feedback ${feedbackType}`}>
          {feedbackText}
        </div>
      )}

      <div className="swipe-controls">
        <button
          className="swipe-button dislike"
          onClick={() => handleButtonSwipe('dislike')}
          disabled={isAnimating || !currentRestaurant}
        >
          ✕
        </button>
        <button
          className="swipe-button like"
          onClick={() => handleButtonSwipe('like')}
          disabled={isAnimating || !currentRestaurant}
        >
          ♥
        </button>
      </div>

      <div className="swipe-instructions">
        <p>Choose your next bite!</p>
      </div>
    </div>
  );
};

export default SwipeInterface;