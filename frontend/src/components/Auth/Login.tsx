import React, { useState } from 'react';
import { authService } from '../../services/auth';
import './Auth.css';

interface LoginProps {
  onLogin: (user: any) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Food Icons Background - Top */}
      <div className="food-icons-background-top">
        <div className="food-row-top">
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
        </div>
      </div>

      {/* Food Icons Background - Bottom */}
      <div className="food-icons-background">
        <div className="food-row">
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
        </div>
      </div>

      {/* SwipeBites Title */}
      <div className="auth-title">
        <h1>SwipeBites</h1>
        <p>Discover great food near Cleveland State University</p>
      </div>

      <div className="auth-card">
        <h2>Welcome Back!</h2>
        <p>Sign in to continue swiping</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToSignup}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;