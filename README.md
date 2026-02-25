# Blogs Backend - Complete Documentation

A RESTful API backend for a blogging platform built with Express.js, MySQL, and JWT authentication. This project provides comprehensive authentication and article management capabilities.

---

## 1️⃣ Approach

### Architecture Overview

The Blogs Backend follows a **layered architecture pattern** that separates concerns across multiple layers:

```
┌─────────────────────────────────────────┐
│      Routes Layer (Express Router)      │
│  - /api/auth (Authentication routes)    │
│  - /api/articles (Article CRUD routes)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Middleware Layer                     │
│  - JWT Verification (verifyJWT)        │
│  - Ownership Check (checkOwnership)     │
│  - CORS & Body Parser                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Controller Layer                     │
│  - authController.js (Auth logic)       │
│  - articleController.js (Article logic) │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Service Layer (Optional)             │
│  - aiService.js (AI features)           │
│  - generateToken.js (Utility)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Data Layer                           │
│  - MySQL Database via mysql2 driver     │
│  - Models define schema structure       │
└─────────────────────────────────────────┘
```

### Folder Structure

```
Blogs-Backend/
├── server.js                 # Entry point - starts the Express server
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (not in repo)
│
├── src/
│   ├── app.js              # Express app configuration & middleware setup
│   │
│   ├── config/
│   │   └── db.js           # MySQL connection pool configuration
│   │
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic (signup, login)
│   │   ├── articleController.js    # Article CRUD operations
│   │   └── aiController.js         # AI-related endpoints (optional)
│   │
│   ├── middleware/
│   │   ├── verifyJWT.js    # JWT token verification middleware
│   │   └── checkOwnership.js # Verify article ownership before update/delete
│   │
│   ├── models/
│   │   ├── userModel.js    # User schema structure reference
│   │   └── articleModel.js # Article schema structure reference
│   │
│   ├── routes/
│   │   ├── authRoutes.js   # Authentication endpoints
│   │   ├── articleRoutes.js # Article endpoints
│   │   └── aiRoutes.js     # AI endpoints (optional)
│   │
│   ├── services/
│   │   ├── aiService.js    # AI integration logic
│   │   └── (Future services)
│   │
│   └── utils/
│       └── generateToken.js # JWT token generation utility
│
└── README.md               # This file
```

### Key Design Decisions

#### 1. **Middleware-Based Security**

- JWT verification is applied at the route level, not globally
- Only routes that require authentication use `verifyJWT` middleware
- This provides flexibility: public routes (GET articles) vs. protected routes (create, update, delete)

**Example:**

```javascript
// Public route - no auth required
router.get("/", getAllArticles);

// Protected route - JWT required
router.post("/", verifyJWT, createArticle);

// Protected + ownership check - both middlewares
router.put("/:id", verifyJWT, checkOwnership, updateArticle);
```

#### 2. **Separation of Concerns**

- **Routes**: Define endpoints and apply middleware
- **Controllers**: Contain business logic
- **Middleware**: Handle cross-cutting concerns (auth, ownership)
- **Config**: Database connection centralized
- **Utils**: Reusable helper functions

#### 3. **Database Connection Pooling**

- Uses MySQL connection pool instead of single connection
- Improves performance under concurrent requests
- Promises-based interface for async/await support

#### 4. **Password Security**

- Bcrypt with salt rounds (10) for password hashing
- Never store plain passwords in database
- Password comparison handled by bcrypt.compare()

#### 5. **JWT Token Management**

- Tokens contain minimal info (user id, email)
- Tokens stored in Authorization header: `Bearer <token>`
- Server validates token on protected routes
- No session storage required (stateless authentication)

#### 6. **Error Handling**

- Consistent JSON response format for errors and success
- Proper HTTP status codes (400, 401, 404, 500)
- Try-catch blocks in all async operations

#### 7. **Ownership Verification**

- `checkOwnership` middleware prevents users from editing/deleting other users' articles
- Must pass `verifyJWT` first to get user info
- Protects data integrity and privacy

---

## 2️⃣ AI Usage

### AI Tools Used

- **GitHub Copilot** - Primary tool for code generation and debugging
- **ChatGPT** - Architecture planning and middleware design

### Where AI Helped

#### ✅ Code Generation

- **Initial Express Setup**: Generated boilerplate for `app.js` with CORS and middleware configuration
- **Controller Functions**: Generated CRUD operations for articles (create, read, update, delete)
- **Error Handling Patterns**: AI suggested consistent error response formats
- **Authentication Flow**: Generated JWT token generation and verification logic

**Example - AI Generated Then Manually Reviewed:**

```javascript
// AI-generated initial version - had issues with error handling
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  // ... incomplete validation
};

// Manually enhanced with:
// ✓ Input validation for all fields
// ✓ Duplicate email checking
// ✓ Proper error status codes
// ✓ Comprehensive try-catch
// ✓ Token generation on success
```

#### ✅ SQL Queries

- **User Table Queries**: Generated SELECT queries for authentication
- **Article Queries**: Generated CRUD queries with filters
- **Parameterized Queries**: AI ensured SQL injection prevention using `?` placeholders

**Manually Reviewed:**

- Verified query efficiency and indexing strategy
- Added proper NULL checks and error handling
- Ensured WHERE clauses appropriately filter results

#### ✅ Middleware Design

- **JWT Verification Middleware**: Generated parser logic for Bearer tokens
- **Ownership Check Middleware**: AI created the pattern for authorization checks
- **Error Response Format**: Generated consistent middleware error responses

**What Was Corrected:**

- Changed from throwing errors to proper middleware error handling
- Added proper next() calls for middleware chain
- Enhanced error messages for debugging

#### ✅ API Design

- **Route Structure**: `/api/auth` and `/api/articles` naming convention
- **RESTful Patterns**: Proper HTTP methods (POST for create, PUT for update, DELETE for delete)
- **Request/Response Format**: Consistent JSON structure with success/message/data fields

#### ✅ Security Implementation

- **Password Hashing**: AI generated bcrypt implementation
- **JWT Strategies**: Generated token signing and verification patterns
- **CORS Configuration**: Generated basic CORS setup

**Manually Enhanced:**

- Set appropriate CORS origins instead of allowing all
- Configured bcrypt salt rounds (10 for security)
- Added token expiration logic

### What Was Manually Reviewed & Corrected

#### 1. **Database Configuration**

- AI suggested simple connection; manually added connection pooling for production
- Verified credentials security (should use .env variables)

#### 2. **Error Messages**

- Made error messages more user-friendly and specific
- Added proper HTTP status codes (400 vs 401 vs 500)

#### 3. **Validation Logic**

- Added comprehensive validation beyond AI suggestions
- Email format validation
- Password strength requirements
- Required field checks

#### 4. **Token Structure**

- Enhanced JWT payload with relevant user data
- Added expiration times (recommended)
- Implemented token refresh strategy (optional)

#### 5. **Response Consistency**

- Standardized all responses with `success`, `message`, `data` structure
- AI generated varied formats; manually unified them

**Standard Response Format:**

```javascript
// Success
{
  success: true,
  message: "Operation successful",
  data: { /* results */ }
}

// Error
{
  success: false,
  message: "Error description"
}
```

#### 6. **Edge Cases**

- Handled duplicate entries better than AI suggestions
- Added proper error differentiation (user errors vs. server errors)
- Implemented ownership verification before allowing updates

---

## 3️⃣ Setup Instructions

### Prerequisites

**System Requirements:**

- Node.js (v16 or higher)
- npm or yarn
- MySQL Server (v8.0 or higher)

**Check Installation:**

```bash
node --version      # Should be v16+
npm --version       # Should be v8+
mysql --version     # Should be v8.0+
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=manager
DB_NAME=knowledge_platform

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Security Note:** Change `JWT_SECRET` in production to a strong random string.

### Backend Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Ektasinha25/Blogs-Backend.git
cd Blogs-Backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

**Dependencies Installed:**

- `express` (v5.2.1) - Web framework
- `mysql2` (v3.18.0) - Database driver
- `bcrypt` (v6.0.0) - Password hashing
- `jsonwebtoken` (v9.0.3) - JWT authentication
- `dotenv` (v17.3.1) - Environment variables
- `cors` (v2.8.6) - Cross-origin requests
- `nodemon` (v3.1.14) - Dev: auto-restart on file changes

#### Step 3: Create MySQL Database

Open MySQL Client:

```bash
mysql -u root -p
```

Run these commands:

```sql
CREATE DATABASE knowledge_platform;
USE knowledge_platform;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Articles Table
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  tags VARCHAR(255),
  summary VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_author_id ON articles(author_id);
CREATE INDEX idx_category ON articles(category);
CREATE INDEX idx_email ON users(email);
```

#### Step 4: Configure Database Connection

Update `src/config/db.js` with your credentials (or use .env):

```javascript
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "manager",
  database: process.env.DB_NAME || "knowledge_platform",
});

module.exports = db.promise();
```

#### Step 5: Start Backend Server

**Development Mode (with auto-restart):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

**Expected Output:**

```
Server running on port 5000
```

#### Step 6: Test Backend Endpoints

**Test Signup:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Frontend Setup

#### Step 1: Create React Application

```bash
npx create-react-app blogs-frontend
cd blogs-frontend
npm install axios react-router-dom
```

#### Step 2: Create Project Structure

```bash
mkdir -p src/{components/{Auth,Articles,Layout},pages,services,context,utils}
```

#### Step 3: Configure API Service

Create `src/services/api.js`:

```javascript
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Step 4: Create .env File

Create `.env` in `blogs-frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Step 5: Reference Implementation Files

All React components are provided in the comprehensive code from Step 1. Key files to create:

- `src/context/AuthContext.jsx` - User authentication state
- `src/components/Auth/Login.jsx` - Login form
- `src/components/Auth/Signup.jsx` - Registration form
- `src/components/Articles/ArticleList.jsx` - Display all articles
- `src/components/Articles/ArticleDetail.jsx` - Single article view
- `src/components/Articles/CreateArticle.jsx` - Create new article
- `src/components/Articles/EditArticle.jsx` - Edit article
- `src/components/Layout/Navbar.jsx` - Navigation bar
- `src/pages/Home.jsx` - Home page
- `src/pages/Dashboard.jsx` - User dashboard
- `src/App.jsx` - Main app with routes
- `src/App.css` - Complete styling

#### Step 6: Start Frontend Development Server

```bash
npm start
```

**Expected Output:**

```
Compiled successfully!

You can now view blogs-frontend in the browser.

  Local:            http://localhost:3000
```

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| POST   | `/api/auth/signup` | Register new user | ❌ No         |
| POST   | `/api/auth/login`  | Login user        | ❌ No         |

### Article Endpoints

| Method | Endpoint            | Description        | Auth Required       |
| ------ | ------------------- | ------------------ | ------------------- |
| GET    | `/api/articles`     | Get all articles   | ❌ No               |
| GET    | `/api/articles/:id` | Get single article | ❌ No               |
| POST   | `/api/articles`     | Create article     | ✅ Yes              |
| PUT    | `/api/articles/:id` | Update article     | ✅ Yes (Owner only) |
| DELETE | `/api/articles/:id` | Delete article     | ✅ Yes (Owner only) |

---

## Running Both Frontend & Backend

### Terminal 1: Backend

```bash
cd Blogs-Backend
npm run dev
```

### Terminal 2: Frontend

```bash
cd blogs-frontend
npm start
```

### Access Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

---

## Troubleshooting

### Issue: "Cannot connect to MySQL"

**Solution:** Verify MySQL server is running and credentials in `.env` are correct

```bash
mysql -u root -p   # Test connection
```

### Issue: "Port 5000 already in use"

**Solution:** Change PORT in `.env` or kill process using port

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "JWT token expired"

**Solution:** Clear localStorage and login again

```javascript
localStorage.removeItem("token");
```

---

## Next Steps

- [ ] Add article search functionality
- [ ] Implement comments on articles
- [ ] Add user profile page
- [ ] Enable AI-powered article suggestions
- [ ] Add article rating/likes system
- [ ] Implement email notifications
- [ ] Set up automated testing (Jest, Mocha)
- [ ] Deploy to production (Heroku, AWS, DigitalOcean)

---

## Author

Your Name / Your Team

## License

ISC

## Repository

[GitHub - Blogs-Backend](https://github.com/Ektasinha25/Blogs-Backend)
