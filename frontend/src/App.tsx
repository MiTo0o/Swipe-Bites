import React, { useState, useEffect } from 'react';
import SwipeInterface from './components/SwipeInterface/SwipeInterface';
import FilterPanel from './components/FilterPanel/FilterPanel';
import LikedRestaurants from './components/LikedRestaurants/LikedRestaurants';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { Restaurant } from './types';
import { authService, User } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [filters, setFilters] = useState<{
    budget?: string;
    maxDistance?: number;
    dietary?: string[];
    cuisine?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showLiked, setShowLiked] = useState(false);
  const [sessionLiked, setSessionLiked] = useState<string[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleSignup = (user: User) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSwipe = (restaurant: Restaurant, action: 'like' | 'dislike') => {
    console.log(`${action} ${restaurant.name}`);
    if (action === 'like') {
      console.log(`Added ${restaurant.name} to liked restaurants`);
      setSessionLiked(prev => [...prev, restaurant._id]);
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.budget) count++;
    if (filters.maxDistance && filters.maxDistance !== 5) count++;
    if (filters.dietary && filters.dietary.length > 0) count++;
    if (filters.cuisine) count++;
    return count;
  };

  if (isAuthLoading) {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        }}>
          <h2 style={{ color: 'white' }}>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        {authMode === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <button
            className="icon-button liked"
            onClick={() => setShowLiked(true)}
            title="Liked Restaurants"
          >
            ♥
          </button>
        </div>
        <div className="header-content">
          <h1><i className="fas fa-utensils app-title-icon"></i> SwipeBites <i className="fas fa-circle app-title-icon-plate"></i></h1>
          <p>Find great food near Cleveland State University</p>
        </div>
        <div className="header-right">
          <button
            className="icon-button filters"
            onClick={() => setShowFilters(true)}
            title="Filters"
          >
            ⚙
          </button>
          <button
            className="icon-button logout"
            onClick={handleLogout}
            title="Logout"
          >
            →
          </button>
        </div>
      </header>
      <main>
        <SwipeInterface
          filters={filters}
          onSwipe={handleSwipe}
        />
      </main>
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />
      <LikedRestaurants
        isOpen={showLiked}
        onClose={() => setShowLiked(false)}
        sessionLiked={sessionLiked}
      />
    </div>
  );
}

export default App;
