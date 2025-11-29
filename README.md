# 🍽️ SwipeBites

A swipe-based restaurant recommendation app for Cleveland State University students.

## Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd Swipe-Bites
npm run install-all
```

### 2. Environment Setup

Copy the example environment files:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Configure your environment variables in `.env`:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Server
PORT=5000
NODE_ENV=development

# Security (generate a strong random string)
SESSION_SECRET=your_secure_random_session_secret_here
```

Configure your frontend environment variables in `frontend/.env`:

```bash
# API endpoint
REACT_APP_API_URL=http://localhost:5000/api

# Build optimization
GENERATE_SOURCEMAP=false
```

**Important:** Contact Zaid or Derzan for env variables to run

### 3. Database Setup
```bash
npm run seed
```

### 4. Run the App
```bash
npm run dev
```

**That's it!** Open http://localhost:3000 and start swiping.

## Features

- **User Authentication**: Sign up/login with email & password
- **Swipe Interface**: Tinder-style swipe right to like, left to pass
- **Smart Filtering**: Budget, distance, dietary preferences, cuisine
- **User Preferences**: Track liked restaurants and swipe history

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: JavaScript + Node.js + Express + MongoDB
- **Testing**: Jest
---
**Happy Swiping!**