# SwipeBites Developer Guide

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Project Structure](#project-structure)
3. [Backend](#backend)
   - [Server Configuration](#server-configuration)
   - [Database Models](#database-models)
   - [API Routes](#api-routes)
   - [Authentication](#authentication)
4. [Frontend](#frontend)
   - [Component Architecture](#component-architecture)
   - [Services Layer](#services-layer)
   - [State Management](#state-management)
5. [Data Flow](#data-flow)
6. [Making Changes](#making-changes)
7. [Testing](#testing)
8. [Known Issues](#known-issues)
9. [Future Improvements](#future-improvements)

---

## System Architecture Overview

SwipeBites follows a **client-server architecture** with a React frontend and Node.js/Express backend, connected to a MongoDB database.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Port 3000)                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │  Components │  │   Services  │  │   State (useState)  │   │  │
│  │  │  - Auth     │  │  - api.ts   │  │   - user            │   │  │
│  │  │  - Swipe    │  │  - auth.ts  │  │   - filters         │   │  │
│  │  │  - Filter   │  │             │  │   - restaurants     │   │  │
│  │  │  - Liked    │  │             │  │                     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS (Axios)
                                    │ Session Cookies
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Express Backend (Port 5000)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                         Middleware                            │  │
│  │   CORS │ JSON Parser │ Session Management │ Error Handler     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                          Routes                               │  │
│  │   /api/restaurants │ /api/users │ /api/swipes                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Mongoose Models                           │  │
│  │          Restaurant │ User                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Mongoose ODM
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas (Cloud)                            │
│          Collections: restaurants, users                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React 19, TypeScript, react-spring   |
| Backend    | Node.js, Express 4.18                |
| Database   | MongoDB Atlas (Mongoose 8.0)         |
| Auth       | express-session, bcryptjs            |
| HTTP       | Axios                                |
| Testing    | Jest, Supertest, React Testing Lib   |

---

## Project Structure

```
Swipe-Bites/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── data/
│   │   └── restaurants.js       # Seed data for restaurants
│   ├── models/
│   │   ├── Restaurant.js        # Restaurant Mongoose schema
│   │   └── User.js              # User Mongoose schema
│   ├── routes/
│   │   ├── __tests__/           # Backend route tests
│   │   │   ├── restaurants.test.js
│   │   │   └── swipes.test.js
│   │   ├── restaurants.js       # Restaurant API endpoints
│   │   ├── swipes.js            # Swipe recording endpoints
│   │   └── users.js             # User auth & preference endpoints
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding script
│   ├── server.js                # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── images/              # Restaurant images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/            # Login and Signup components
│   │   │   ├── FilterPanel/     # Restaurant filtering UI
│   │   │   ├── LikedRestaurants/# Saved restaurants panel
│   │   │   ├── RestaurantCard/  # Individual restaurant display
│   │   │   └── SwipeInterface/  # Main swiping functionality
│   │   ├── services/
│   │   │   ├── api.ts           # Restaurant & swipe API calls
│   │   │   └── auth.ts          # Authentication service
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces
│   │   ├── App.tsx              # Root component
│   │   └── index.tsx            # React entry point
│   └── package.json
├── package.json                 # Root package with dev scripts
└── README.md
```

---

## Backend

### Server Configuration

The Express server (`backend/server.js`) configures:

- **CORS**: Allows credentials from `localhost:3000` (dev) or production domain
- **Session**: Server-side session with 24-hour expiry
- **Routes**: Mounts three route modules under `/api/`

```javascript
// Route mounting
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swipes', swipeRoutes);
```

**Environment Variables Required:**
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 5000) |
| `SESSION_SECRET` | Secret for session encryption |
| `NODE_ENV` | `development` or `production` |

### Database Models

#### Restaurant Schema

```javascript
{
  name: String,           // Required, trimmed
  description: String,    // Required
  rating: Number,         // 1-5 stars
  priceRange: String,     // '$', '$$', '$$$', '$$$$'
  distance: Number,       // Miles from CSU campus
  cuisineType: String,    // 'American', 'Mexican', 'Asian', etc.
  dietaryOptions: [String], // ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher']
  imageUrl: String,       // Path to image in /public/images/
  address: String,        // Full street address
  phone: String,          // Optional
  website: String,        // Optional
  hours: String,          // Operating hours display
  tags: [String],         // ['trendy', 'casual', 'date night', etc.]
  location: {             // GPS coordinates
    lat: Number,
    lng: Number
  },
  timestamps: true        // createdAt, updatedAt
}
```

**Indexes:** Compound index on `{ cuisineType, priceRange, rating }`

#### User Schema

```javascript
{
  email: String,          // Unique, lowercase, required
  password: String,       // Hashed with bcrypt, min 6 chars
  preferences: {
    budget: String,       // '$' to '$$$$', default '$$'
    maxDistance: Number,  // 1-25 miles, default 5
    dietaryRestrictions: [String],
    cuisinePreferences: [String]
  },
  swipeHistory: [{
    restaurantId: ObjectId,  // Reference to Restaurant
    action: String,          // 'like' or 'dislike'
    timestamp: Date
  }],
  likedRestaurants: [ObjectId], // Array of Restaurant references
  timestamps: true
}
```

**Password Hashing:** Uses bcrypt pre-save hook with salt rounds of 10.

**Indexes:** Index on `{ email: 1 }`

### API Routes

#### Restaurant Routes (`/api/restaurants`)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | List restaurants with filtering | `budget`, `maxDistance`, `dietary`, `cuisine`, `excludeSwipedIds` |
| GET | `/:id` | Get single restaurant | - |
| GET | `/explore/trending` | Top 10 by rating | - |

**Filtering Logic:**
- `budget`: Exact match on `priceRange`
- `maxDistance`: `distance <= value`
- `dietary`: `dietaryOptions $in [values]`
- `cuisine`: Exact match on `cuisineType`
- `excludeSwipedIds`: Comma-separated IDs to exclude

#### User Routes (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create new user |
| POST | `/login` | No | Authenticate user |
| POST | `/logout` | No | Destroy session |
| GET | `/me` | Yes | Get current user |
| GET | `/preferences` | Yes | Get user preferences |
| PUT | `/preferences` | Yes | Update preferences |
| GET | `/liked` | Yes | Get liked restaurants (populated) |
| DELETE | `/liked` | Yes | Clear like history |
| GET | `/swipe-history` | Yes | Get all swipe records |

#### Swipe Routes (`/api/swipes`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Record a swipe |
| GET | `/stats` | Yes | Get swipe statistics |

**Recording a Swipe:**
```javascript
// POST /api/swipes
{
  "restaurantId": "507f1f77bcf86cd799439011",
  "action": "like"  // or "dislike"
}
```

### Authentication

Authentication uses **server-side sessions** stored in memory (default Express session store).

**Session Flow:**
1. User registers/logs in → server creates session, stores `userId` in `req.session`
2. Session ID sent as cookie to client
3. Subsequent requests include cookie → server retrieves session
4. `requireAuth` middleware checks `req.session.userId` exists

```javascript
// Auth middleware pattern used in routes
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  next();
};
```

---

## Frontend

### Component Architecture

```
App.tsx (Root)
├── Auth Flow (when not logged in)
│   ├── Login.tsx
│   └── Signup.tsx
│
└── Main App (when logged in)
    ├── Header
    │   ├── LikedRestaurants trigger button
    │   ├── FilterPanel trigger button
    │   └── Logout button
    ├── SwipeInterface.tsx (main content)
    │   └── RestaurantCard.tsx (rendered in card stack)
    ├── FilterPanel.tsx (modal overlay)
    └── LikedRestaurants.tsx (modal overlay)
```

#### Component Responsibilities

| Component | Purpose | Key State |
|-----------|---------|-----------|
| `App.tsx` | Root state management, auth flow, routing | `user`, `filters`, `showFilters`, `showLiked` |
| `SwipeInterface` | Card stack, swipe animations, data fetching | `restaurants`, `currentIndex`, `isAnimating` |
| `RestaurantCard` | Restaurant info display | Props only (stateless) |
| `FilterPanel` | Filter form with budget, distance, dietary, cuisine | Local form state |
| `LikedRestaurants` | Two tabs: session likes, all-time likes | `activeTab`, `permanentLiked`, `sessionRestaurants` |
| `Login/Signup` | Auth forms | `email`, `password`, `loading`, `error` |

### Services Layer

Two service modules handle API communication:

**`api.ts`** - Data operations:
```typescript
restaurantAPI.getRestaurants(filters)  // GET /restaurants
restaurantAPI.getRestaurant(id)        // GET /restaurants/:id
restaurantAPI.getTrendingRestaurants() // GET /restaurants/explore/trending

userAPI.getPreferences()               // GET /users/preferences
userAPI.updatePreferences(prefs)       // PUT /users/preferences
userAPI.getLikedRestaurants()          // GET /users/liked
userAPI.clearLikedRestaurants()        // DELETE /users/liked

swipeAPI.recordSwipe(restaurantId, action)  // POST /swipes
swipeAPI.getSwipeStats()                    // GET /swipes/stats
```

**`auth.ts`** - Authentication:
```typescript
authService.register(email, password)  // POST /users/register
authService.login(email, password)     // POST /users/login
authService.logout()                   // POST /users/logout
authService.getCurrentUser()           // GET /users/me
```

Both use Axios with `withCredentials: true` for session cookies.

### State Management

The app uses **React's built-in state** (useState, useEffect) rather than external state managers:

- **User state** (`App.tsx`): Global user object, null when logged out
- **Filter state** (`App.tsx`): Passed down to `SwipeInterface` as prop
- **Restaurant list** (`SwipeInterface`): Fetched on mount and when filters change
- **Session liked** (`App.tsx`): Tracks restaurants liked in current session (for immediate UI feedback)

### Swipe Animation System

The `SwipeInterface` uses **react-spring** for smooth animations:

1. **Card Stack**: Shows 3 cards stacked with decreasing scale (1.0, 0.95, 0.9)
2. **Swipe Animation**: On button click, card animates off-screen with rotation
3. **Background Card Promotion**: Next card animates to top position
4. **Shadow Transition Delay**: CSS shadow transition disabled during card swap to prevent visual glitch

```typescript
// Animation springs
const [{ x, y, rotation, scale }, set] = useSpring(() => ({
  x: 0, y: 0, rotation: 0, scale: 1
}));

// Swipe action triggers exit animation
set({ x: direction * window.innerWidth, rotation: direction * 30 });
```

---

## Data Flow

### Swipe Action Flow

```
User clicks ♥ (like)
    │
    ▼
handleButtonSwipe('like')
    │
    ├── Show feedback text ("Yum!", "Tasty!", etc.)
    ├── Animate card off-screen
    │
    ▼ (after 300ms)
handleSwipe(restaurant, 'like')
    │
    ├── POST /api/swipes { restaurantId, action: 'like' }
    │   └── Server: push to swipeHistory, add to likedRestaurants
    │
    ├── Update local swipedRestaurants array
    ├── Call onSwipe callback (updates sessionLiked in App)
    │
    ▼
setCurrentIndex(prev => prev + 1)  // Show next card
```

### Filter Change Flow

```
User opens FilterPanel
    │
    ▼
Adjusts filters (budget, distance, dietary, cuisine)
    │
    ▼
Clicks "Apply Filters"
    │
    ├── FilterPanel calls onFiltersChange(newFilters)
    ├── App.tsx updates filters state
    │
    ▼
SwipeInterface useEffect detects filter change
    │
    ▼
loadRestaurants() called
    │
    ├── GET /api/restaurants?budget=$&maxDistance=3...
    │
    ▼
setRestaurants(data) + setCurrentIndex(0)
```

---

## Making Changes

### Adding a New Restaurant Field

1. **Update the Restaurant model** (`backend/models/Restaurant.js`):
   ```javascript
   // Add new field to schema
   newField: {
     type: String,
     default: ''
   }
   ```

2. **Update seed data** (`backend/data/restaurants.js`):
   ```javascript
   {
     name: "Restaurant Name",
     // ... existing fields
     newField: "value"
   }
   ```

3. **Run seed script** to update database:
   ```bash
   npm run seed
   ```

4. **Update TypeScript interface** (`frontend/src/types/index.ts`):
   ```typescript
   export interface Restaurant {
     // ... existing fields
     newField?: string;
   }
   ```

5. **Display in RestaurantCard** (`frontend/src/components/RestaurantCard/RestaurantCard.tsx`)

### Adding a New Filter Option

1. **Add filter to backend query builder** (`backend/routes/restaurants.js`):
   ```javascript
   if (req.query.newFilter) {
     query.fieldName = req.query.newFilter;
   }
   ```

2. **Update API service** (`frontend/src/services/api.ts`):
   ```typescript
   getRestaurants: async (filters?: {
     // ... existing
     newFilter?: string;
   })
   ```

3. **Add UI controls in FilterPanel** (`frontend/src/components/FilterPanel/FilterPanel.tsx`)

4. **Update filter state in App.tsx**

### Adding a New API Endpoint

1. **Create route handler** in appropriate file under `backend/routes/`
2. **Write tests** in `backend/routes/__tests__/`
3. **Add service method** in `frontend/src/services/api.ts`
4. **Call from component** as needed

### Modifying the Swipe Animation

Animation configuration is in `SwipeInterface.tsx`:

```typescript
// Exit animation parameters
const exitX = direction * window.innerWidth;  // How far card travels
const exitRotation = direction * 30;          // Rotation degrees

// Animation timing
setTimeout(() => handleSwipe(...), 300);      // Delay before state update
setTimeout(() => clearFeedback(), 800);       // Feedback display duration
```

---

## Testing

### Backend Tests

Located in `backend/routes/__tests__/`. Uses Jest with Supertest for HTTP testing.

```bash
# Run backend tests
cd backend
npm test

# Watch mode
npm run test:watch
```

**Test Structure:**
- Models are mocked using `jest.mock()`
- Each route file has corresponding test file
- Tests cover success cases, error handling, and validation

### Frontend Tests

Uses React Testing Library with Jest.

```bash
# Run frontend tests
cd frontend
npm test

# With coverage
npm run test:coverage
```

### Running All Tests

From project root:
```bash
npm test
```

---

## Known Issues

1. **Session Store in Memory**: The default Express session loses session whenever server restarts.

2. **No Gesture Support**: Swipe interface uses buttons only, actual physical swiping will be added later

3. **No Password Reset**: Users cant reset forgotten passwords.

4. **No live API data**: Google places or any other API service was to expensive for this project

---

## Quick Reference

### Common Commands

```bash
# Install all dependencies
npm run install-all

# Start development servers (backend + frontend)
npm run dev

# Seed database
npm run seed

# Run all tests
npm test

# Build frontend for production
npm run build

# Start production server
npm start
```

### API Response Format

All endpoints return consistent JSON structure:

```javascript
// Success
{
  "success": true,
  "data": { ... }  // or array
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

### Key File Locations

| Task | File(s) |
|------|---------|
| Add restaurant fields | `backend/models/Restaurant.js`, `frontend/src/types/index.ts` |
| Modify filters | `backend/routes/restaurants.js`, `frontend/src/components/FilterPanel/` |
| Change auth logic | `backend/routes/users.js`, `frontend/src/services/auth.ts` |
| Update swipe behavior | `backend/routes/swipes.js`, `frontend/src/components/SwipeInterface/` |
| Add seed data | `backend/data/restaurants.js` |
| Modify styling | Component-specific `.css` files |

---

