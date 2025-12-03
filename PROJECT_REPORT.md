# SOFTWARE PROJECT FINAL REPORT

## SwipeBites - Restaurant Recommendation Application

---

**Team Members:** Zaid, Derzan

**Date:** December 3, 2025

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose and Scope](#11-purpose-and-scope)
   - 1.2 [Product Overview](#12-product-overview)
   - 1.3 [Structure of the Document](#13-structure-of-the-document)
   - 1.4 [Terms, Acronyms, and Abbreviations](#14-terms-acronyms-and-abbreviations)
2. [Project Management Plan](#2-project-management-plan)
   - 2.1 [Project Organization](#21-project-organization)
   - 2.2 [Lifecycle Model Used](#22-lifecycle-model-used)
   - 2.3 [Risk Analysis](#23-risk-analysis)
   - 2.4 [Hardware and Software Resource Requirements](#24-hardware-and-software-resource-requirements)
   - 2.5 [Deliverables and Schedule](#25-deliverables-and-schedule)
3. [Requirement Specifications](#3-requirement-specifications)
   - 3.1 [Stakeholders for the System](#31-stakeholders-for-the-system)
   - 3.2 [Use Cases](#32-use-cases)
   - 3.3 [Rationale for Use Case Model](#33-rationale-for-your-use-case-model)
   - 3.4 [Non-functional Requirements](#34-non-functional-requirements)
4. [Architecture](#4-architecture)
   - 4.1 [Architectural Style(s) Used](#41-architectural-styles-used)
   - 4.2 [Architectural Model](#42-architectural-model)
   - 4.3 [Technology, Software, and Hardware Used](#43-technology-software-and-hardware-used)
   - 4.4 [Rationale for Architectural Style and Model](#44-rationale-for-your-architectural-style-and-model)
5. [Design](#5-design)
   - 5.1 [User Interface Design](#51-user-interface-design)
   - 5.2 [Components Design](#52-components-design)
   - 5.3 [Database Design](#53-database-design)
   - 5.4 [Rationale for Detailed Design Models](#54-rationale-for-your-detailed-design-models)
   - 5.5 [Traceability from Requirements to Design](#55-traceability-from-requirements-to-detailed-design-models)
6. [Test Management](#6-test-management)
   - 6.1 [Complete List of System Test Cases](#61-a-complete-list-of-system-test-cases)
   - 6.2 [Traceability of Test Cases to Use Cases](#62-traceability-of-test-cases-to-use-cases)
   - 6.3 [Techniques Used for Test Case Generation](#63-techniques-used-for-test-case-generation)
   - 6.4 [Test Results and Assessments](#64-test-results-and-assessments)
   - 6.5 [Defects Reports](#65-defects-reports)
7. [Conclusions](#7-conclusions)
   - 7.1 [Outcomes of the Project](#71-outcomes-of-the-project)
   - 7.2 [Lessons Learned](#72-lessons-learned)
   - 7.3 [Future Development](#73-future-development)
8. [References](#references)

---

## List of Figures

- **Figure 1:** System Architecture Diagram
- **Figure 2:** Use Case Diagram
- **Figure 3:** Component Architecture Diagram
- **Figure 4:** Database Schema Diagram
- **Figure 5:** User Interface Flow Diagram
- **Figure 6:** Swipe Action Data Flow Diagram

---

## List of Tables

- **Table 1:** Technology Stack
- **Table 2:** Risk Analysis Matrix
- **Table 3:** Project Deliverables Schedule
- **Table 4:** API Endpoints Summary
- **Table 5:** Test Cases Summary
- **Table 6:** Test Case to Use Case Traceability Matrix
- **Table 7:** Requirements to Design Traceability Matrix

---

## 1. Introduction

### 1.1 Purpose and Scope

**Purpose:**
SwipeBites is a web-based restaurant recommendation application designed specifically for Cleveland State University (CSU) students. The application provides an intuitive, swipe-based interface inspired by popular dating apps like Tinder, allowing users to discover and save restaurants near campus quickly and engagingly.

**Scope:**
The system encompasses:
- User authentication and account management
- Restaurant discovery through a swipe-based interface
- Filtering restaurants by budget, distance, dietary preferences, and cuisine type
- Persistent storage of liked restaurants across sessions
- Swipe history tracking and statistics

**Out of Scope:**
- Real-time restaurant data from external APIs (e.g., Google Places)
- Online ordering or reservation functionality
- Social features (sharing, group recommendations)
- Mobile native applications (iOS/Android)

### 1.2 Product Overview

**Capabilities:**

| Feature | Description |
|---------|-------------|
| User Authentication | Secure signup/login with email and password |
| Swipe Interface | Tinder-style card swiping to like or pass on restaurants |
| Smart Filtering | Filter by budget ($-$$$$), distance (1-25 miles), dietary options, and cuisine |
| Liked Restaurants | View session likes and all-time liked restaurant history |
| Swipe Statistics | Track total swipes, likes, dislikes, and like ratio |

**Scenarios for Using the Product:**

1. **New User Discovery:** A CSU student signs up, sets their budget to "$" and max distance to 2 miles, then swipes through affordable nearby restaurants to find lunch options.

2. **Dietary-Restricted User:** A vegetarian student enables the vegetarian filter and discovers restaurants with vegetarian-friendly options.

3. **Date Night Planning:** A student filters for "$$$" restaurants and "Italian" cuisine to find an upscale dinner spot.

4. **Quick Reference:** A returning user opens their liked restaurants list to revisit a previously discovered restaurant.

### 1.3 Structure of the Document

This document follows a standard software project report structure:

- **Section 1 (Introduction):** Provides context, purpose, and overview
- **Section 2 (Project Management):** Covers organization, lifecycle, and planning
- **Section 3 (Requirements):** Details stakeholders, use cases, and requirements
- **Section 4 (Architecture):** Describes system architecture and technology choices
- **Section 5 (Design):** Covers UI, component, and database design
- **Section 6 (Testing):** Documents test cases, results, and quality assessment
- **Section 7 (Conclusions):** Summarizes outcomes, lessons, and future work

### 1.4 Terms, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| CSU | Cleveland State University |
| JWT | JSON Web Token |
| MERN | MongoDB, Express, React, Node.js |
| ODM | Object Document Mapper |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| UI/UX | User Interface / User Experience |

---

## 2. Project Management Plan

### 2.1 Project Organization

**Team Structure:**

| Role | Responsibilities | Team Member |
|------|------------------|-------------|
| Full-Stack Developer | Frontend/Backend development, UI/UX | Zaid |
| Full-Stack Developer | Frontend/Backend development, Database | Derzan |

**Communication:**
- Regular code reviews via Git pull requests
- Documentation maintained in Markdown files within the repository

### 2.2 Lifecycle Model Used

The project followed an **Agile/Iterative** development model with the following characteristics:

1. **Iterative Development:** Features were developed in small increments
2. **Continuous Integration:** Regular commits and testing
3. **Flexible Requirements:** Ability to adapt to changing needs (e.g., removal of public API integration)
4. **Working Software Priority:** Focus on delivering functional features over comprehensive documentation

**Sprint Structure:**
- Initial Setup & Architecture
- Core Swipe Interface Development
- Authentication Implementation
- Filtering System
- Liked Restaurants Feature
- Testing & Bug Fixes
- Documentation & Polish

### 2.3 Risk Analysis

**Table 2: Risk Analysis Matrix**

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy |
|---------|------------------|-------------|--------|---------------------|
| R1 | External API costs too high | High | High | Use static restaurant data instead of live API |
| R2 | Session management complexity | Medium | Medium | Use express-session with in-memory store |
| R3 | Database connection issues | Low | High | Use cloud-hosted MongoDB Atlas with retry logic |
| R4 | Performance with large datasets | Low | Medium | Implement pagination and database indexing |
| R5 | Cross-browser compatibility | Medium | Low | Use standard CSS and tested React components |
| R6 | Authentication security vulnerabilities | Medium | High | Use bcrypt for password hashing, HTTPS in production |

**Risk Outcome:**
- R1 materialized: Google Places API was too expensive; mitigated by using curated static data
- R2 was managed successfully with express-session
- Other risks did not materialize

### 2.4 Hardware and Software Resource Requirements

**Development Environment:**

| Component | Requirement |
|-----------|-------------|
| Operating System | macOS, Windows, or Linux |
| Node.js | v18.0+ |
| npm | v9.0+ |
| MongoDB | Atlas Cloud (M0 Free Tier) |
| Code Editor | VS Code (recommended) |
| Browser | Chrome, Firefox, Safari, or Edge |

**Production Environment:**

| Component | Requirement |
|-----------|-------------|
| Hosting | Any Node.js compatible hosting (Heroku, Railway, etc.) |
| Database | MongoDB Atlas |
| Memory | 512MB minimum |
| Storage | 100MB for application |

**Software Dependencies:**

*Backend:*
- Express.js 4.18.2
- Mongoose 8.0.0
- bcryptjs 2.4.3
- express-session 1.17.3
- cors 2.8.5
- dotenv 16.3.1

*Frontend:*
- React 19.2.0
- TypeScript 4.9.5
- Axios 1.6.0
- react-spring 9.7.0
- @use-gesture/react 10.2.24

*Testing:*
- Jest 29.7.0
- Supertest 6.3.3
- React Testing Library 16.3.0

### 2.5 Deliverables and Schedule

**Table 3: Project Deliverables Schedule**

| Deliverable | Description | Status |
|-------------|-------------|--------|
| D1: Project Setup | Repository, dependencies, folder structure | ✅ Complete |
| D2: Database Design | MongoDB schemas for Restaurant and User | ✅ Complete |
| D3: Backend API | RESTful API with authentication | ✅ Complete |
| D4: Frontend UI | React components with swipe interface | ✅ Complete |
| D5: Authentication | User registration, login, logout | ✅ Complete |
| D6: Filtering System | Budget, distance, dietary, cuisine filters | ✅ Complete |
| D7: Liked Restaurants | Session and persistent liked list | ✅ Complete |
| D8: Testing Suite | Unit and integration tests | ✅ Complete |
| D9: Documentation | README, Developer Guide, User Manual | ✅ Complete |
| D10: Final Report | This document | ✅ Complete |

---

## 3. Requirement Specifications

### 3.1 Stakeholders for the System

| Stakeholder | Role | Interests |
|-------------|------|-----------|
| CSU Students | Primary Users | Discover restaurants near campus easily |
| Restaurant Owners | Indirect Beneficiaries | Increased visibility to student demographic |
| Development Team | Creators | Build functional, maintainable software |
| Course Instructor | Evaluator | Assess project quality and completeness |

### 3.2 Use Cases

#### 3.2.1 Graphic Use Case Model

```
                                    ┌─────────────────────────────────────┐
                                    │           SwipeBites System         |
                                    │                                     │
    ┌──────────┐                    │  ┌─────────────────────────────┐    │
    │          │                    │  │                             │    │
    │   User   │────────────────────┼──│  UC1: Register Account      │    │
    │          │                    │  │                             │    │
    └──────────┘                    │  └─────────────────────────────┘    │
         │                          │                                     │
         │                          │  ┌─────────────────────────────┐    │
         │                          │  │                             │    │
         ├──────────────────────────┼──│  UC2: Login                 │    │
         │                          │  │                             │    │
         │                          │  └─────────────────────────────┘    │
         │                          │                                     │
         │                          │  ┌─────────────────────────────┐    │
         │                          │  │                             │    │
         ├──────────────────────────┼──│  UC3: Swipe Restaurants     │    │
         │                          │  │                             │    │
         │                          │  └─────────────────────────────┘    │
         │                          │                                     │
         │                          │  ┌─────────────────────────────┐    │
         │                          │  │                             │    │
         ├──────────────────────────┼──│  UC4: Apply Filters         │    │
         │                          │  │                             │    │
         │                          │  └─────────────────────────────┘    │
         │                          │                                     │
         │                          │  ┌─────────────────────────────┐    │
         │                          │  │                             │    │
         ├──────────────────────────┼──│  UC5: View Liked List       │    │
         │                          │  │                             │    │
         │                          │  └─────────────────────────────┘    │
         │                          │                                     │
         │                          │  ┌─────────────────────────────┐    │
         │                          │  │                             │    │
         └──────────────────────────┼──│  UC6: Logout                │    │
                                    │  │                             │    │
                                    │  └─────────────────────────────┘    │
                                    │                                     │
                                    └─────────────────────────────────────┘
```

#### 3.2.2 Textual Description for Each Use Case

**UC1: Register Account**

| Field | Description |
|-------|-------------|
| Use Case ID | UC1 |
| Name | Register Account |
| Actor | User (unregistered) |
| Precondition | User is not logged in |
| Main Flow | 1. User clicks "Sign Up" button<br>2. System displays registration form<br>3. User enters email and password (min 6 chars)<br>4. User confirms password<br>5. User clicks "Create Account"<br>6. System validates input<br>7. System creates account and logs user in<br>8. System redirects to main swipe interface |
| Alternate Flow | 3a. Email already exists → Show error message<br>4a. Passwords don't match → Show error message<br>6a. Validation fails → Show specific error |
| Postcondition | User account created, user logged in |

**UC2: Login**

| Field | Description |
|-------|-------------|
| Use Case ID | UC2 |
| Name | Login |
| Actor | Registered User |
| Precondition | User has an account, is not logged in |
| Main Flow | 1. User clicks "Login" button<br>2. System displays login form<br>3. User enters email and password<br>4. User clicks "Sign In"<br>5. System validates credentials<br>6. System creates session and redirects to main interface |
| Alternate Flow | 5a. Invalid credentials → Show error message |
| Postcondition | User is authenticated with active session |

**UC3: Swipe Restaurants**

| Field | Description |
|-------|-------------|
| Use Case ID | UC3 |
| Name | Swipe Restaurants |
| Actor | Authenticated User |
| Precondition | User is logged in, restaurants are loaded |
| Main Flow | 1. System displays restaurant card with details<br>2. User views restaurant information<br>3a. User clicks ♥ (like) button<br>3b. User clicks ✕ (dislike) button<br>4. System animates card off-screen<br>5. System records swipe action<br>6. System displays next restaurant card<br>7. Repeat until no more restaurants |
| Alternate Flow | 7a. No more restaurants → Show "You've seen them all" message |
| Postcondition | Swipe recorded in user's history, liked restaurants saved |

**UC4: Apply Filters**

| Field | Description |
|-------|-------------|
| Use Case ID | UC4 |
| Name | Apply Filters |
| Actor | Authenticated User |
| Precondition | User is logged in |
| Main Flow | 1. User clicks filter button (⚙)<br>2. System displays filter panel<br>3. User selects budget range ($-$$$$)<br>4. User adjusts max distance slider<br>5. User selects dietary options (vegetarian, gluten-free)<br>6. User selects cuisine type<br>7. User clicks "Apply Filters"<br>8. System closes panel and refreshes restaurant list |
| Alternate Flow | 2a. User clicks "Clear Filters" → Reset to defaults |
| Postcondition | Restaurant list filtered according to selections |

**UC5: View Liked List**

| Field | Description |
|-------|-------------|
| Use Case ID | UC5 |
| Name | View Liked List |
| Actor | Authenticated User |
| Precondition | User is logged in |
| Main Flow | 1. User clicks liked button (♥)<br>2. System displays liked restaurants panel<br>3. User views "This Session" tab (current session likes)<br>4. User switches to "All Time" tab<br>5. System displays all historically liked restaurants<br>6. User clicks on restaurant to view details |
| Alternate Flow | 5a. User clicks "Clear All" → System clears like history |
| Postcondition | User has viewed their liked restaurants |

**UC6: Logout**

| Field | Description |
|-------|-------------|
| Use Case ID | UC6 |
| Name | Logout |
| Actor | Authenticated User |
| Precondition | User is logged in |
| Main Flow | 1. User clicks logout button (→)<br>2. System destroys session<br>3. System redirects to login page |
| Postcondition | User session terminated, user on login page |

### 3.3 Rationale for Use Case Model

The use case model was designed around the core user journey:

1. **Authentication First:** UC1 and UC2 establish the necessary foundation for personalized experiences
2. **Core Functionality:** UC3 (swiping) is the primary value proposition, designed as the central use case
3. **Enhancement Features:** UC4 (filtering) and UC5 (liked list) add depth without complicating the core flow
4. **Session Management:** UC6 ensures proper security hygiene

The model prioritizes simplicity and focuses on the essential interactions that deliver value to CSU students looking for restaurant recommendations.

### 3.4 Non-functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR1 | Performance | App loads in under 3 seconds | < 3s |
| NFR2 | Performance | Swipe animation completes smoothly | 60 FPS |
| NFR3 | Performance | Handle 39+ restaurants without lag | No stuttering |
| NFR4 | Usability | Intuitive swipe interface | No training needed |
| NFR5 | Usability | Responsive on desktop browsers | Chrome, Firefox, Safari |
| NFR6 | Security | Passwords hashed with bcrypt | Salt rounds: 10 |
| NFR7 | Security | Session-based authentication | 24-hour expiry |
| NFR8 | Reliability | Graceful error handling | No crashes on errors |
| NFR9 | Reliability | Handle network failures | Show fallback UI |
| NFR10 | Maintainability | Modular component architecture | Separation of concerns |

---

## 4. Architecture

### 4.1 Architectural Style(s) Used

SwipeBites employs a **Client-Server Architecture** with the following patterns:

1. **Three-Tier Architecture:**
   - Presentation Layer (React Frontend)
   - Business Logic Layer (Express Backend)
   - Data Layer (MongoDB Database)

2. **RESTful API Design:**
   - Stateless HTTP endpoints
   - Resource-based URLs
   - Standard HTTP methods (GET, POST, PUT, DELETE)

3. **Component-Based UI Architecture:**
   - Reusable React components
   - Unidirectional data flow
   - Local state management with React hooks

### 4.2 Architectural Model

**Figure 1: System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Port 3000)                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │  │
│  │  │  Components │  │   Services  │  │   State (useState)  │    │  │
│  │  │  - Auth     │  │  - api.ts   │  │   - user            │    │  │
│  │  │  - Swipe    │  │  - auth.ts  │  │   - filters         │    │  │
│  │  │  - Filter   │  │             │  │   - restaurants     │    │  │
│  │  │  - Liked    │  │             │  │                     │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS (Axios)
                                    │ Session Cookies
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Express Backend (Port 5000)                     │
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

**Table 4: API Endpoints Summary**

| Route | Method | Endpoint | Auth Required | Description |
|-------|--------|----------|---------------|-------------|
| Restaurants | GET | /api/restaurants | No | List with filters |
| Restaurants | GET | /api/restaurants/:id | No | Get single restaurant |
| Restaurants | GET | /api/restaurants/explore/trending | No | Top 10 by rating |
| Users | POST | /api/users/register | No | Create account |
| Users | POST | /api/users/login | No | Authenticate |
| Users | POST | /api/users/logout | No | End session |
| Users | GET | /api/users/me | Yes | Get current user |
| Users | GET | /api/users/liked | Yes | Get liked restaurants |
| Users | DELETE | /api/users/liked | Yes | Clear like history |
| Swipes | POST | /api/swipes | Yes | Record swipe |
| Swipes | GET | /api/swipes/stats | Yes | Get swipe statistics |

### 4.3 Technology, Software, and Hardware Used

**Table 1: Technology Stack**

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | React | 19.2.0 | UI component library |
| Frontend Language | TypeScript | 4.9.5 | Type-safe JavaScript |
| HTTP Client | Axios | 1.6.0 | API communication |
| Animation | react-spring | 9.7.0 | Smooth swipe animations |
| Backend Runtime | Node.js | 18+ | JavaScript runtime |
| Backend Framework | Express | 4.18.2 | Web server framework |
| Database | MongoDB Atlas | - | Cloud-hosted NoSQL database |
| ODM | Mongoose | 8.0.0 | MongoDB object modeling |
| Authentication | express-session | 1.17.3 | Session management |
| Password Hashing | bcryptjs | 2.4.3 | Secure password storage |
| Testing | Jest | 29.7.0 | Test runner |
| API Testing | Supertest | 6.3.3 | HTTP assertions |
| UI Testing | React Testing Library | 16.3.0 | Component testing |

### 4.4 Rationale for Your Architectural Style and Model

**Why Client-Server with REST API:**
- Clear separation between frontend and backend enables independent development
- RESTful design provides predictable, stateless API behavior
- Enables potential future mobile app development using the same API

**Why React for Frontend:**
- Component-based architecture promotes reusability
- Virtual DOM provides excellent performance for dynamic UIs
- Large ecosystem with mature animation libraries (react-spring)
- TypeScript integration for type safety

**Why Express + MongoDB:**
- Express is lightweight and flexible for API development
- MongoDB's document model maps naturally to JavaScript objects
- Schema flexibility allows iterative development
- MongoDB Atlas provides reliable cloud hosting with free tier

**Why Session-Based Authentication:**
- Simpler than JWT for this application scope
- Server-side session provides better security control
- Automatic handling via cookies eliminates token management

---

## 5. Design

### 5.1 User Interface Design

**Figure 5: User Interface Flow Diagram**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│    Login     │────▶│    Signup    │────▶│    Login     │
│    Screen    │◀────│    Screen    │     │    Screen    │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
        │
        │ (authenticated)
        ▼
┌──────────────────────────────────────────────────────────┐
│                     Main Interface                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    Header                          │  │
│  │   [♥ Liked]    SwipeBites    [⚙ Filter] [→ Logout] │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │              Restaurant Card Stack                 │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  [Image]                                     │  │  │
│  │  │  Restaurant Name          ⭐ 4.5              │  │  │
│  │  │  Cuisine Type  |  $$  |  1.2 mi              │  │  │
│  │  │  Description...                              │  │  │
│  │  │  [Dietary Tags]                              │  │  │
│  │  │  [Website Link]                              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│              [✕ Dislike]      [♥ Like]                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
        │                               │
        ▼                               ▼
┌──────────────┐                ┌──────────────┐
│   Filter     │                │    Liked     │
│   Panel      │                │  Restaurants │
│  (Overlay)   │                │   (Overlay)  │
└──────────────┘                └──────────────┘
```

**UI Design Principles:**

1. **Simplicity:** Clean interface with minimal cognitive load
2. **Familiarity:** Swipe paradigm familiar from dating apps
3. **Visual Hierarchy:** Restaurant image prominent, details secondary
4. **Responsive Feedback:** Animated transitions for all interactions
5. **Accessibility:** Focus states, sufficient color contrast

### 5.2 Components Design

**Figure 3: Component Architecture Diagram**

```
App.tsx (Root)
├── Auth Flow (when not logged in)
│   ├── Login.tsx
│   │   └── Handles: email/password input, login API call
│   └── Signup.tsx
│       └── Handles: registration form, validation, signup API call
│
└── Main App (when logged in)
    ├── Header
    │   ├── LikedRestaurants trigger button (♥)
    │   ├── Title (SwipeBites)
    │   ├── FilterPanel trigger button (⚙)
    │   └── Logout button (→)
    │
    ├── SwipeInterface.tsx (main content)
    │   ├── Card Stack (3 visible cards)
    │   │   └── RestaurantCard.tsx (rendered for each)
    │   │       ├── Image section
    │   │       ├── Info section (name, rating, cuisine, price, distance)
    │   │       ├── Description
    │   │       ├── Dietary tags
    │   │       └── Website link
    │   ├── Swipe Feedback ("YUM!", "NOPE")
    │   └── Control Buttons (Like/Dislike)
    │
    ├── FilterPanel.tsx (modal overlay)
    │   ├── Budget selector (dropdown)
    │   ├── Distance slider (range input)
    │   ├── Dietary checkboxes
    │   ├── Cuisine selector
    │   └── Apply/Clear buttons
    │
    └── LikedRestaurants.tsx (modal overlay)
        ├── Tab navigation (This Session / All Time)
        ├── Restaurant list
        └── Clear All button
```

**Static Component Model (Key Interfaces):**

```typescript
// Restaurant Interface
interface Restaurant {
  _id: string;
  name: string;
  description: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  distance: number;
  cuisineType: string;
  dietaryOptions: string[];
  imageUrl: string;
  address: string;
  phone?: string;
  website?: string;
  hours: string;
  tags: string[];
  location: { lat: number; lng: number };
}

// User Interface
interface User {
  _id: string;
  email: string;
  preferences: UserPreferences;
  swipeHistory: SwipeAction[];
  likedRestaurants: string[];
}

// Props Interfaces
interface SwipeInterfaceProps {
  filters: FilterState;
  onSwipe: (restaurant: Restaurant, action: 'like' | 'dislike') => void;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}
```

**Dynamic Model (Swipe Action Flow):**

**Figure 6: Swipe Action Data Flow Diagram**

```
User clicks ♥ (like)
    │
    ▼
handleButtonSwipe('like')
    │
    ├── Show feedback text ("Yum!", "Tasty!", etc.)
    ├── Animate card off-screen (react-spring)
    │
    ▼ (after 300ms delay)
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

### 5.3 Database Design

**Figure 4: Database Schema Diagram**

```
┌─────────────────────────────────────┐
│           restaurants               │
├─────────────────────────────────────┤
│ _id: ObjectId (PK)                  │
│ name: String (required)             │
│ description: String (required)      │
│ rating: Number (1-5)                │
│ priceRange: Enum ['$','$$','$$$','$$$$'] │
│ distance: Number                    │
│ cuisineType: String                 │
│ dietaryOptions: [String]            │
│ imageUrl: String                    │
│ address: String (required)          │
│ phone: String                       │
│ website: String                     │
│ hours: String                       │
│ tags: [String]                      │
│ location: { lat: Number, lng: Number } │
│ createdAt: Date                     │
│ updatedAt: Date                     │
├─────────────────────────────────────┤
│ INDEX: (cuisineType, priceRange, rating) │
└─────────────────────────────────────┘
              │
              │ Referenced by
              ▼
┌─────────────────────────────────────┐
│              users                  │
├─────────────────────────────────────┤
│ _id: ObjectId (PK)                  │
│ email: String (unique, required)    │
│ password: String (hashed, min 6)    │
│ preferences: {                      │
│   budget: Enum ['$'-'$$$$']         │
│   maxDistance: Number (1-25)        │
│   dietaryRestrictions: [String]     │
│   cuisinePreferences: [String]      │
│ }                                   │
│ swipeHistory: [{                    │
│   restaurantId: ObjectId (FK)       │
│   action: Enum ['like','dislike']   │
│   timestamp: Date                   │
│ }]                                  │
│ likedRestaurants: [ObjectId] (FK)   │
│ createdAt: Date                     │
│ updatedAt: Date                     │
├─────────────────────────────────────┤
│ INDEX: (email)                      │
└─────────────────────────────────────┘
```

**Database Design Decisions:**

1. **Embedded Swipe History:** Swipe history is embedded in the User document rather than a separate collection to optimize read performance for common queries.

2. **Reference Array for Liked Restaurants:** Uses ObjectId references to enable population when detailed restaurant data is needed.

3. **Compound Index:** The restaurants collection uses a compound index on frequently filtered fields to optimize query performance.

4. **Password Hashing:** Bcrypt with 10 salt rounds is applied via a Mongoose pre-save hook.

### 5.4 Rationale for Your Detailed Design Models

**Component Design Rationale:**

1. **Separation of Concerns:** Each component has a single responsibility
   - RestaurantCard: Display only
   - SwipeInterface: Interaction logic
   - FilterPanel: Filter management
   - Services: API communication

2. **Props-Based Communication:** Child components receive data via props, maintaining unidirectional data flow

3. **Service Layer Abstraction:** API calls are centralized in service modules, making it easy to modify endpoints or add caching

**Database Design Rationale:**

1. **Document Model Fit:** Restaurant data is self-contained and rarely updated, ideal for documents

2. **Embedded vs. Referenced:** Swipe history is embedded because it's always accessed with the user; restaurants are referenced because they're large and shared

3. **Index Strategy:** Compound index on filter fields ensures fast queries for the main restaurant list

### 5.5 Traceability from Requirements to Detailed Design Models

**Table 7: Requirements to Design Traceability Matrix**

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| UC1: Register Account | Signup.tsx, /api/users/register | Form validation, bcrypt hashing, session creation |
| UC2: Login | Login.tsx, /api/users/login | Credential validation, session management |
| UC3: Swipe Restaurants | SwipeInterface.tsx, RestaurantCard.tsx, /api/swipes | Card stack, react-spring animations, swipe recording |
| UC4: Apply Filters | FilterPanel.tsx, /api/restaurants (query params) | Form controls, query builder, filtered API calls |
| UC5: View Liked List | LikedRestaurants.tsx, /api/users/liked | Tab interface, populated restaurant data |
| UC6: Logout | App.tsx header, /api/users/logout | Session destruction, state reset |
| NFR1: Load < 3s | React SPA, optimized bundling | Code splitting, efficient renders |
| NFR2: Smooth animations | react-spring library | Hardware-accelerated CSS transforms |
| NFR6: Password security | bcryptjs in User model | Pre-save hook with salt rounds |
| NFR8: Error handling | try/catch in routes, error states in components | Consistent error response format |

---

## 6. Test Management

### 6.1 A Complete List of System Test Cases

**Table 5: Test Cases Summary**

| ID | Test Case | Description | Type | Status |
|----|-----------|-------------|------|--------|
| TC01 | App Launch | Home screen loads in < 3 seconds | Performance | ✅ Pass |
| TC02 | Swipe Right | Restaurant added to liked list when swiping right | Functional | ✅ Pass |
| TC03 | Swipe Left | Restaurant skipped (not saved) when swiping left | Functional | ✅ Pass |
| TC04 | Budget/Distance Filter | Display only matching restaurants when filters applied | Functional | ✅ Pass |
| TC05 | Dietary Filter | Display vegetarian restaurants only when filter applied | Functional | ✅ Pass |
| TC06 | Location Search | Restaurants can be filtered by distance | Functional | ✅ Pass |
| TC07 | Network Failure | Handle network error gracefully | Reliability | ✅ Pass |
| TC08 | No Data | Show fallback when API returns no restaurants | Reliability | ✅ Pass |
| TC09 | Stress Test | No lag when swiping 10+ times rapidly | Performance | ✅ Pass |
| TC11 | Liked List Display | Shows all previously liked restaurants | Functional | ✅ Pass |
| TC12 | Data Persistence | User preferences loaded when app reopens | Functional | ✅ Pass |
| TC13 | Load Performance | App loads in < 2 seconds with 39 restaurants | Performance | ✅ Pass |
| TC14 | API Auth Failure | App logs error and displays fallback on invalid API | Reliability | ✅ Pass |

**Backend Unit Tests (Additional):**

| ID | Test Case | Description | Status |
|----|-----------|-------------|--------|
| BE01 | GET /restaurants | Returns all restaurants when no filters | ✅ Pass |
| BE02 | GET /restaurants?budget | Filters restaurants by budget | ✅ Pass |
| BE03 | GET /restaurants?maxDistance | Filters by maximum distance | ✅ Pass |
| BE04 | GET /restaurants?dietary | Filters by dietary options | ✅ Pass |
| BE05 | GET /restaurants (excludeSwipedIds) | Excludes swiped restaurant IDs | ✅ Pass |
| BE06 | GET /restaurants (error) | Handles database errors | ✅ Pass |
| BE07 | GET /restaurants/:id | Returns restaurant by ID | ✅ Pass |
| BE08 | GET /restaurants/:id (not found) | Returns 404 when not found | ✅ Pass |
| BE09 | GET /restaurants/explore/trending | Returns trending restaurants | ✅ Pass |
| BE10 | POST /swipes | Records a new swipe | ✅ Pass |
| BE11 | POST /swipes (dislike) | Records dislike without adding to liked | ✅ Pass |
| BE12 | POST /swipes (validation) | Validates required fields | ✅ Pass |
| BE13 | GET /swipes/stats | Returns swipe statistics | ✅ Pass |

### 6.2 Traceability of Test Cases to Use Cases

**Table 6: Test Case to Use Case Traceability Matrix**

| Use Case | Related Test Cases |
|----------|-------------------|
| UC1: Register Account | (Covered by auth service tests) |
| UC2: Login | TC12 (persistence implies successful auth) |
| UC3: Swipe Restaurants | TC02, TC03, TC09, BE10, BE11 |
| UC4: Apply Filters | TC04, TC05, TC06, BE01-BE05 |
| UC5: View Liked List | TC11, TC02 |
| UC6: Logout | (Covered by auth service tests) |
| NFR1: Performance | TC01, TC13 |
| NFR8: Error Handling | TC07, TC08, TC14, BE06, BE08 |

### 6.3 Techniques Used for Test Case Generation

1. **Equivalence Partitioning:**
   - Budget filter: Valid values ($, $$, $$$, $$$$)
   - Distance filter: Valid range (1-25 miles)
   - Swipe action: Valid values (like, dislike)

2. **Boundary Value Analysis:**
   - Distance slider min (1) and max (25) values
   - Password minimum length (6 characters)
   - Rating bounds (1-5)

3. **Error Guessing:**
   - Network failure scenarios
   - Empty API responses
   - Invalid credentials
   - Missing required fields

4. **Use Case Testing:**
   - Each use case has corresponding functional tests
   - Happy path and alternate flows covered

5. **Performance Testing:**
   - Load time benchmarks
   - Stress testing with rapid interactions

### 6.4 Test Results and Assessments

**Test Execution Summary:**
- **Test Suites:** 2 passed (Frontend integration + Backend unit tests)
- **Total Tests:** 26 passed
- **Test Coverage:** Routes and core components

**Quality Assessment:**

| Metric | Result | Assessment |
|--------|--------|------------|
| Test Pass Rate | 100% | Excellent |
| Code Coverage (Routes) | High | Good coverage of API endpoints |
| Performance Tests | All pass | Meets requirements |
| Error Handling Tests | All pass | Robust error handling |

**Software Quality Assessment:**

The test suite demonstrates that:
1. Core functionality works as designed
2. Error handling is robust and graceful
3. Performance meets specified requirements
4. Filters work correctly individually and in combination

### 6.5 Defects Reports

**Resolved Defects:**

| ID | Description | Severity | Resolution |
|----|-------------|----------|------------|
| D001 | Session lost on server restart | Medium | Known limitation documented; Redis for production |
| D002 | Swipe animation stuttering on low-end devices | Low | Optimized by reducing shadow transitions during animation |
| D003 | Filter panel not closing after apply on mobile | Low | Fixed by ensuring proper state update |

**Known Issues (Not Fixed):**

| ID | Description | Severity | Workaround |
|----|-------------|----------|------------|
| K001 | No password reset functionality | Medium | Users must create new account |
| K002 | No physical swipe gesture support | Low | Use button controls |
| K003 | Session stored in memory only | Medium | Sessions lost on server restart |

---

## 7. Conclusions

### 7.1 Outcomes of the Project

**Goals Achieved:**

| Goal | Status | Notes |
|------|--------|-------|
| Swipe-based restaurant discovery | ✅ Achieved | Smooth, intuitive interface |
| User authentication | ✅ Achieved | Secure email/password auth |
| Restaurant filtering | ✅ Achieved | Budget, distance, dietary, cuisine |
| Liked restaurant persistence | ✅ Achieved | Session and all-time lists |
| Responsive UI | ✅ Achieved | Works on desktop browsers |
| Performance requirements | ✅ Achieved | All benchmarks met |

**Goals Partially Achieved:**

| Goal | Status | Notes |
|------|--------|-------|
| Real-time restaurant data | ⚠️ Partial | Used curated static data due to API costs |
| Mobile responsiveness | ⚠️ Partial | Works but not optimized for all devices |

**Deliverables Completed:**
- Fully functional web application
- Backend API with authentication
- Database with 39 curated Cleveland restaurants
- Test suite with 100% pass rate
- Documentation (README, Developer Guide, User Manual, Project Report)

### 7.2 Lessons Learned

**Technical Lessons:**

1. **API Costs Matter:** External APIs like Google Places can be expensive. using static data is also important
   
3. **Session Management Complexity:** While simpler than JWT, server-side sessions require careful consideration for production.

4. **Animation Performance:** CSS-based animations with react-spring provide smooth performance when properly optimized.

5. **TypeScript Benefits:** Type safety caught numerous bugs during development and improved code quality.

**Process Lessons:**

1. **Iterative Development Works:** Being able to adapt requirements (removing API integration) was crucial.

2. **Documentation Early:** Writing documentation alongside code ensures accuracy.

3. **Testing Investment:** Upfront test writing saved debugging time later.

### 7.3 Future Development

**Short-term Improvements:**

1. **Password Reset:** Implement email-based password recovery
2. **Touch Gestures:** Add physical swipe gesture support for mobile
3. **Session Store:** Migrate to Redis for production session storage
4. **Additional Filters:** Add hours/open now filtering

**Medium-term Features:**

1. **Mobile Apps:** Native iOS/Android applications using the existing API
2. **Social Features:** Share liked restaurants with friends
3. **Restaurant Details:** Expanded view with menus, photos, reviews
4. **Map Integration:** Visual map of nearby restaurants

**Long-term Vision:**

1. **Machine Learning:** Personalized recommendations based on swipe history
2. **Restaurant Portal:** Allow restaurants to update their information
3. **Reservation Integration:** Book tables directly from the app
4. **Expanded Coverage:** Support for multiple cities/universities

---

## References

1. React Documentation. https://react.dev/
2. Express.js Documentation. https://expressjs.com/
3. MongoDB Manual. https://www.mongodb.com/docs/manual/
4. Mongoose Documentation. https://mongoosejs.com/docs/
5. Jest Documentation. https://jestjs.io/docs/getting-started
6. React Spring Documentation. https://www.react-spring.dev/
7. Axios Documentation. https://axios-http.com/docs/intro
8. bcrypt.js Documentation. https://github.com/dcodeIO/bcrypt.js

---

